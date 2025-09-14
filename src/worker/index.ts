import { Hono } from "hono";
import { cors } from "hono/cors";
import { 
  authMiddleware, 
  exchangeCodeForSessionToken, 
  getOAuthRedirectUrl,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME 
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors({
  origin: ['http://localhost:5173', 'https://craftconnect.app'],
  credentials: true,
}));

// Auth endpoints
app.get('/api/oauth/google/redirect_url', async (c) => {
  const redirectUrl = await getOAuthRedirectUrl('google', {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", zValidator("json", z.object({ code: z.string() })), async (c) => {
  const { code } = c.req.valid("json");

  const sessionToken = await exchangeCodeForSessionToken(code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }
  
  // Check if user exists in our database
  const existingUser = await c.env.DB.prepare(
    "SELECT * FROM users WHERE id = ?"
  ).bind(user.id).first();

  return c.json({ ...user, profile: existingUser });
});

app.get('/api/logout', async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === 'string') {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Artisan Profile Endpoints
app.get("/api/artisan/profile", authMiddleware, async (c) => {
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  try {
    // Get user basic info
    const userInfo = await c.env.DB.prepare(
      "SELECT * FROM users WHERE id = ?"
    ).bind(user.id).first();

    // Get artisan profile
    const artisanProfile = await c.env.DB.prepare(
      "SELECT * FROM artisan_profiles WHERE user_id = ?"
    ).bind(user.id).first();

    if (!userInfo) {
      return c.json({ error: "User profile not found" }, 404);
    }

    // Merge user info with artisan profile
    const profile = {
      ...userInfo,
      ...artisanProfile
    };

    return c.json(profile);
  } catch (error) {
    console.error('Error fetching artisan profile:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

app.put("/api/artisan/profile", authMiddleware, zValidator("json", z.object({
  full_name: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  craft_type: z.string().optional(),
  specialty: z.string().optional(),
  years_experience: z.string().optional(),
  story: z.string().optional(),
  workshop_location: z.string().optional(),
  social_media_links: z.string().optional(),
})), async (c) => {
  const user = c.get("user");
  const profileData = c.req.valid("json");

  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  try {
    // Update users table
    await c.env.DB.prepare(`
      UPDATE users SET 
        full_name = COALESCE(?, full_name),
        phone = COALESCE(?, phone),
        location = COALESCE(?, location),
        bio = COALESCE(?, bio),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      profileData.full_name || null,
      profileData.phone || null,
      profileData.location || null,
      profileData.bio || null,
      user.id
    ).run();

    // Update or insert artisan profile
    await c.env.DB.prepare(`
      INSERT OR REPLACE INTO artisan_profiles (
        user_id, craft_type, specialty, years_experience, story, 
        workshop_location, social_media_links, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      user.id,
      profileData.craft_type || null,
      profileData.specialty || null,
      profileData.years_experience ? parseInt(profileData.years_experience) : null,
      profileData.story || null,
      profileData.workshop_location || null,
      profileData.social_media_links || null
    ).run();

    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating artisan profile:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Buyer Profile Endpoints
app.get("/api/buyer/profile", authMiddleware, async (c) => {
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  try {
    const userInfo = await c.env.DB.prepare(
      "SELECT * FROM users WHERE id = ?"
    ).bind(user.id).first();

    if (!userInfo) {
      return c.json({ error: "User profile not found" }, 404);
    }

    return c.json(userInfo);
  } catch (error) {
    console.error('Error fetching buyer profile:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

app.put("/api/buyer/profile", authMiddleware, zValidator("json", z.object({
  full_name: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
})), async (c) => {
  const user = c.get("user");
  const profileData = c.req.valid("json");

  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  try {
    await c.env.DB.prepare(`
      UPDATE users SET 
        full_name = COALESCE(?, full_name),
        phone = COALESCE(?, phone),
        location = COALESCE(?, location),
        bio = COALESCE(?, bio),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      profileData.full_name || null,
      profileData.phone || null,
      profileData.location || null,
      profileData.bio || null,
      user.id
    ).run();

    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating buyer profile:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// User profile endpoints
app.post("/api/users/profile", authMiddleware, zValidator("json", z.object({
  user_type: z.enum(["artisan", "buyer"]),
  full_name: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
})), async (c) => {
  const user = c.get("user");
  const profileData = c.req.valid("json");

  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  await c.env.DB.prepare(`
    INSERT OR REPLACE INTO users (id, email, user_type, full_name, phone, location, bio, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).bind(
    user.id,
    user.email,
    profileData.user_type,
    profileData.full_name || null,
    profileData.phone || null,
    profileData.location || null,
    profileData.bio || null
  ).run();

  return c.json({ success: true });
});

// Featured artisans for homepage
app.get("/api/featured-artisans", async (c) => {
  const artisans = await c.env.DB.prepare(`
    SELECT u.*, ap.craft_type, ap.specialty, ap.years_experience
    FROM users u
    LEFT JOIN artisan_profiles ap ON u.id = ap.user_id
    WHERE u.user_type = 'artisan'
    ORDER BY u.created_at DESC
    LIMIT 6
  `).all();

  return c.json(artisans.results);
});

// AI Description Generation with Gemini
app.post("/api/generate-description", authMiddleware, zValidator("json", z.object({
  name: z.string(),
  category: z.string(),
  images: z.array(z.string()).optional(),
})), async (c) => {
  const user = c.get("user");
  const { name, category, images } = c.req.valid("json");

  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  try {
    const genAI = new GoogleGenerativeAI((c.env as any).GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate a compelling product description for a handcrafted item with the following details:
    
Product Name: ${name}
Category: ${category}
${images && images.length > 0 ? `Images: ${images.join(', ')}` : ''}

Please create a detailed, engaging description that:
1. Highlights the craftsmanship and quality
2. Mentions traditional techniques if applicable
3. Describes the aesthetic appeal and uses
4. Is 2-3 paragraphs long
5. Appeals to buyers who appreciate handmade items
6. Includes emotional connection to the craft

Write in a warm, authentic tone that represents an artisan's passion for their work.`;

    const result = await model.generateContent(prompt);
    const description = result.response.text();

    return c.json({ description });
  } catch (error) {
    console.error('Error generating description:', error);
    return c.json({ error: 'Failed to generate description' }, 500);
  }
});

// AI Story Generation for Artisans with Gemini
app.post("/api/generate-story", authMiddleware, zValidator("json", z.object({
  name: z.string(),
  craft_type: z.string(),
  location: z.string().optional(),
  years_experience: z.string().optional(),
  specialty: z.string().optional(),
  workshop_location: z.string().optional(),
})), async (c) => {
  const user = c.get("user");
  const { name, craft_type, location, years_experience, specialty, workshop_location } = c.req.valid("json");

  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  try {
    const genAI = new GoogleGenerativeAI((c.env as any).GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Create a beautiful, inspiring artisan story for ${name}, who specializes in ${craft_type}. 

Details:
- Name: ${name}
- Craft: ${craft_type}
- Location: ${location || 'India'}
- Experience: ${years_experience ? `${years_experience} years` : 'passionate artisan'}
- Specialty: ${specialty || 'traditional techniques'}
- Workshop: ${workshop_location || 'home workshop'}

Write a compelling 3-4 paragraph story that:
1. Captures their journey into this craft
2. Describes their passion and dedication
3. Highlights what makes their work unique
4. Connects with traditional heritage and culture
5. Shows their personal connection to the craft
6. Inspires customers about the story behind each pieces

Write in first person as if ${name} is telling their own story. Make it authentic, warm, and inspiring. Focus on the emotional connection to the craft and the pride in creating something beautiful with their hands.`;

    const result = await model.generateContent(prompt);
    const story = result.response.text();

    return c.json({ story });
  } catch (error) {
    console.error('Error generating story:', error);
    return c.json({ error: 'Failed to generate story' }, 500);
  }
});

// Image Enhancement Endpoint
app.post("/api/enhance-image", authMiddleware, zValidator("json", z.object({
  imageUrl: z.string(),
})), async (c) => {
  const user = c.get("user");
  const { imageUrl } = c.req.valid("json");

  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  try {
    // For now, we'll return the same image URL as we don't have actual image enhancement API
    // In a real implementation, you would integrate with an image enhancement service
    // like Adobe's AI image enhancement or similar services
    
    // Placeholder enhancement response
    return c.json({ 
      enhancedUrl: imageUrl,
      message: "Image enhancement feature coming soon!" 
    });
  } catch (error) {
    console.error('Error enhancing image:', error);
    return c.json({ error: 'Failed to enhance image' }, 500);
  }
});

// Products endpoints
app.post("/api/products", authMiddleware, zValidator("json", z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  category: z.string().optional(),
  images: z.string().optional(),
  stock_quantity: z.number(),
})), async (c) => {
  const user = c.get("user");
  const productData = c.req.valid("json");

  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  await c.env.DB.prepare(`
    INSERT INTO products (artisan_id, name, description, price, category, images, stock_quantity, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(
    user.id,
    productData.name,
    productData.description || null,
    productData.price,
    productData.category || null,
    productData.images || null,
    productData.stock_quantity
  ).run();

  return c.json({ success: true });
});

app.get("/api/products", async (c) => {
  const products = await c.env.DB.prepare(`
    SELECT p.*, u.full_name as artisan_name
    FROM products p
    JOIN users u ON p.artisan_id = u.id
    WHERE p.is_active = 1
    ORDER BY p.created_at DESC
  `).all();

  return c.json(products.results);
});

app.get("/api/products/:id", async (c) => {
  const id = c.req.param("id");
  
  const product = await c.env.DB.prepare(`
    SELECT p.*, u.full_name as artisan_name, u.profile_image as artisan_image
    FROM products p
    JOIN users u ON p.artisan_id = u.id
    WHERE p.id = ? AND p.is_active = 1
  `).bind(id).first();

  if (!product) {
    return c.json({ error: "Product not found" }, 404);
  }

  return c.json(product);
});

// Get artisan's products
app.get("/api/artisan/:id/products", async (c) => {
  const artisanId = c.req.param("id");
  
  const products = await c.env.DB.prepare(`
    SELECT * FROM products 
    WHERE artisan_id = ? AND is_active = 1
    ORDER BY created_at DESC
  `).bind(artisanId).all();

  return c.json(products.results);
});

// Orders endpoints
app.post("/api/orders", authMiddleware, zValidator("json", z.object({
  product_id: z.number(),
  quantity: z.number(),
  total_amount: z.number(),
  payment_method: z.string(),
  payment_details: z.any().optional(),
})), async (c) => {
  const user = c.get("user");
  const orderData = c.req.valid("json");

  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  try {
    // Get product and artisan info
    const product = await c.env.DB.prepare(`
      SELECT artisan_id FROM products WHERE id = ?
    `).bind(orderData.product_id).first();

    if (!product) {
      return c.json({ error: "Product not found" }, 404);
    }

    // Create order
    const result = await c.env.DB.prepare(`
      INSERT INTO orders (buyer_id, artisan_id, product_id, quantity, total_amount, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      user.id,
      product.artisan_id,
      orderData.product_id,
      orderData.quantity,
      orderData.total_amount
    ).run();

    // Update product stock
    await c.env.DB.prepare(`
      UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?
    `).bind(orderData.quantity, orderData.product_id).run();

    return c.json({ success: true, orderId: result.meta.last_row_id });
  } catch (error) {
    console.error('Error creating order:', error);
    return c.json({ error: 'Failed to create order' }, 500);
  }
});

// Send OTP endpoint
app.post("/api/send-otp", zValidator("json", z.object({
  phone: z.string(),
})), async (c) => {
  const { phone } = c.req.valid("json");
  
  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In a real implementation, you would:
    // 1. Store the OTP in database with expiration
    // 2. Send SMS via service like Twilio
    
    // For demo purposes, log the OTP
    console.log(`OTP for ${phone}: ${otp}`);
    
    return c.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return c.json({ error: 'Failed to send OTP' }, 500);
  }
});

// Verify OTP endpoint
app.post("/api/verify-otp", zValidator("json", z.object({
  phone: z.string(),
  otp: z.string(),
})), async (c) => {
  const { otp } = c.req.valid("json");
  
  try {
    // In a real implementation, verify OTP from database
    // For demo purposes, accept any 6-digit OTP
    if (otp.length === 6 && /^\d+$/.test(otp)) {
      return c.json({ success: true, verified: true });
    } else {
      return c.json({ error: 'Invalid OTP' }, 400);
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return c.json({ error: 'Failed to verify OTP' }, 500);
  }
});

export default app;
