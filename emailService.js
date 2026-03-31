const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function getEmailHTML(name, lang = "en") {
  if (lang === "he") {
    return `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(160deg, #065F46 0%, #1D9E75 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">DailyBite</h1>
          <p style="color: #c8e6c9; margin: 5px 0 0; font-size: 14px;">התוכנית שמשנה את הדרך שבה את אוכלת</p>
        </div>

        <!-- Welcome -->
        <div style="padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
          <h2 style="color: #065F46; margin-top: 0;">ברוכה הבאה, ${name}!</h2>
          <p style="font-size: 16px; color: #333; line-height: 1.7;">
            את עכשיו חלק מקהילת DailyBite — תוכנית תזונה מותאמת אישית, ללא גלוטן, שנבנתה במיוחד עבור נשים מעל גיל 40.
          </p>

          <!-- What you get -->
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #1D9E75;">
            <h3 style="color: #065F46; margin-top: 0; font-size: 16px;">מה מחכה לך באפליקציה?</h3>
            <p style="font-size: 14px; color: #333; line-height: 1.7; margin-bottom: 0;">
              תוכנית שבועית מלאה עם ארוחות מאוזנות, מחשבון קלוריות אישי, מעקב מים, תוכנית אימונים ועוד — הכל במקום אחד.
            </p>
          </div>

          <!-- Features -->
          <h3 style="color: #065F46; font-size: 15px;">הנה מה שתוכלי לעשות:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 12px; vertical-align: top; width: 36px;">
                <span style="font-size: 22px;">📸</span>
              </td>
              <td style="padding: 10px 12px;">
                <strong style="color: #333; font-size: 14px;">סורקת צלחת</strong>
                <p style="color: #666; margin: 3px 0 0; font-size: 13px; line-height: 1.5;">צלמי את הארוחה — הבינה המלאכותית מזהה את המאכלים ומחשבת קלוריות ומאקרו מיד.</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; vertical-align: top;">
                <span style="font-size: 22px;">🍽️</span>
              </td>
              <td style="padding: 10px 12px;">
                <strong style="color: #333; font-size: 14px;">תפריט שבועי ללא גלוטן</strong>
                <p style="color: #666; margin: 3px 0 0; font-size: 13px; line-height: 1.5;">7 ימים של ארוחות מאוזנות עם מאקרו מפורט לכל מרכיב. 1,150 קלוריות ביום.</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; vertical-align: top;">
                <span style="font-size: 22px;">📊</span>
              </td>
              <td style="padding: 10px 12px;">
                <strong style="color: #333; font-size: 14px;">מחשבון קלוריות אישי</strong>
                <p style="color: #666; margin: 3px 0 0; font-size: 13px; line-height: 1.5;">יעד יומי מותאם לפי גיל, משקל, גובה ורמת פעילות.</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; vertical-align: top;">
                <span style="font-size: 22px;">💧</span>
              </td>
              <td style="padding: 10px 12px;">
                <strong style="color: #333; font-size: 14px;">מעקב מים</strong>
                <p style="color: #666; margin: 3px 0 0; font-size: 13px; line-height: 1.5;">8 כוסות ביום עם מעקב בנגיעה ותזכורות.</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; vertical-align: top;">
                <span style="font-size: 22px;">🏋️</span>
              </td>
              <td style="padding: 10px 12px;">
                <strong style="color: #333; font-size: 14px;">אימונים יומיים</strong>
                <p style="color: #666; margin: 3px 0 0; font-size: 13px; line-height: 1.5;">7–12 דקות ביום, עומס נמוך, בלי קפיצות — עם סרטוני הדרכה.</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; vertical-align: top;">
                <span style="font-size: 22px;">🌿</span>
              </td>
              <td style="padding: 10px 12px;">
                <strong style="color: #333; font-size: 14px;">בריאות הבטן</strong>
                <p style="color: #666; margin: 3px 0 0; font-size: 13px; line-height: 1.5;">מעקב נפיחויות, דטוקס 48 שעות, 13 מתכונים ללא גלוטן וטיפים לאכילה נכונה.</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; vertical-align: top;">
                <span style="font-size: 22px;">📈</span>
              </td>
              <td style="padding: 10px 12px;">
                <strong style="color: #333; font-size: 14px;">מעקב התקדמות</strong>
                <p style="color: #666; margin: 3px 0 0; font-size: 13px; line-height: 1.5;">גרפי משקל, רצפים יומיים ומעקב השלמה — כדי לראות כמה התקדמת.</p>
              </td>
            </tr>
          </table>

          <!-- First step -->
          <div style="background-color: #fefce8; padding: 16px 20px; border-radius: 8px; margin: 24px 0; border-right: 4px solid #eab308;">
            <p style="font-size: 14px; color: #854d0e; margin: 0; line-height: 1.6;">
              <strong>הצעד הראשון שלך:</strong> היכנסי ללוח הבקרה, מלאי את המחשבון וקבלי את יעד הקלוריות האישי שלך.
            </p>
          </div>

          <!-- CTA -->
          <div style="text-align: center; margin: 28px 0;">
            <a href="https://www.dailybite.fit/dashboard" style="background: linear-gradient(160deg, #065F46 0%, #1D9E75 100%); color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">
              ללוח הבקרה שלי &larr;
            </a>
          </div>

          <p style="font-size: 14px; color: #333; line-height: 1.7;">
            צריכה עזרה? פשוט השיבי להודעה הזו — אנחנו כאן בשבילך.
          </p>

          <p style="font-size: 14px; color: #333; line-height: 1.7;">
            לבריאות שלך,<br>
            <strong>צוות DailyBite</strong>
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="font-size: 11px; color: #999; margin: 0;">
            &copy; 2026 DailyBite — כל הזכויות שמורות.
          </p>
          <p style="font-size: 11px; color: #999; margin: 5px 0 0;">
            קיבלת הודעה זו כי נרשמת באתר www.dailybite.fit
          </p>
          <p style="font-size: 11px; margin: 8px 0 0;">
            <a href="https://www.dailybite.fit" style="color: #1D9E75; text-decoration: none;">אתר</a>
            &nbsp;&middot;&nbsp;
            <a href="mailto:${process.env.GMAIL_USER}?subject=Unsubscribe" style="color: #999; text-decoration: none;">ביטול הרשמה</a>
          </p>
        </div>
      </div>
    `;
  }

  // English version
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <!-- Header -->
      <div style="background: linear-gradient(160deg, #065F46 0%, #1D9E75 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">DailyBite</h1>
        <p style="color: #c8e6c9; margin: 5px 0 0; font-size: 14px;">The plan that transforms how you eat</p>
      </div>

      <!-- Welcome -->
      <div style="padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
        <h2 style="color: #065F46; margin-top: 0;">Welcome, ${name}!</h2>
        <p style="font-size: 16px; color: #333; line-height: 1.7;">
          You're now part of the DailyBite community — a personalized, gluten-free meal planner built specifically for women over 40.
        </p>

        <!-- What you get -->
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1D9E75;">
          <h3 style="color: #065F46; margin-top: 0; font-size: 16px;">What's waiting for you?</h3>
          <p style="font-size: 14px; color: #333; line-height: 1.7; margin-bottom: 0;">
            A complete weekly plan with balanced gluten-free meals, a personal calorie calculator, water tracking, daily workouts, and more — all in one beautiful app.
          </p>
        </div>

        <!-- Features -->
        <h3 style="color: #065F46; font-size: 15px;">Here's what you can do:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 12px; vertical-align: top; width: 36px;">
              <span style="font-size: 22px;">📸</span>
            </td>
            <td style="padding: 10px 12px;">
              <strong style="color: #333; font-size: 14px;">Scan Your Plate</strong>
              <p style="color: #666; margin: 3px 0 0; font-size: 13px; line-height: 1.5;">Snap a photo of your meal — AI identifies the food and calculates calories & macros instantly.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; vertical-align: top;">
              <span style="font-size: 22px;">🍽️</span>
            </td>
            <td style="padding: 10px 12px;">
              <strong style="color: #333; font-size: 14px;">7-Day Gluten-Free Meal Plan</strong>
              <p style="color: #666; margin: 3px 0 0; font-size: 13px; line-height: 1.5;">Complete balanced meals with detailed macros per ingredient. 1,150 cal/day.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; vertical-align: top;">
              <span style="font-size: 22px;">📊</span>
            </td>
            <td style="padding: 10px 12px;">
              <strong style="color: #333; font-size: 14px;">Personal Calorie Calculator</strong>
              <p style="color: #666; margin: 3px 0 0; font-size: 13px; line-height: 1.5;">Daily target based on your age, weight, height & activity level.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; vertical-align: top;">
              <span style="font-size: 22px;">💧</span>
            </td>
            <td style="padding: 10px 12px;">
              <strong style="color: #333; font-size: 14px;">Water Tracker</strong>
              <p style="color: #666; margin: 3px 0 0; font-size: 13px; line-height: 1.5;">8 glasses a day with tap-to-track and daily reminders.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; vertical-align: top;">
              <span style="font-size: 22px;">🏋️</span>
            </td>
            <td style="padding: 10px 12px;">
              <strong style="color: #333; font-size: 14px;">Daily Workouts</strong>
              <p style="color: #666; margin: 3px 0 0; font-size: 13px; line-height: 1.5;">7–12 minute low-impact exercises with video tutorials. No jumping, safe for joints.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; vertical-align: top;">
              <span style="font-size: 22px;">🌿</span>
            </td>
            <td style="padding: 10px 12px;">
              <strong style="color: #333; font-size: 14px;">Gut Health</strong>
              <p style="color: #666; margin: 3px 0 0; font-size: 13px; line-height: 1.5;">Bloating tracker, 48-hour detox plan, 13 anti-bloat recipes, and eating tips for better digestion.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; vertical-align: top;">
              <span style="font-size: 22px;">📈</span>
            </td>
            <td style="padding: 10px 12px;">
              <strong style="color: #333; font-size: 14px;">Progress Tracking</strong>
              <p style="color: #666; margin: 3px 0 0; font-size: 13px; line-height: 1.5;">Weight charts, daily streaks, and completion tracking — see how far you've come.</p>
            </td>
          </tr>
        </table>

        <!-- First step -->
        <div style="background-color: #fefce8; padding: 16px 20px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #eab308;">
          <p style="font-size: 14px; color: #854d0e; margin: 0; line-height: 1.6;">
            <strong>Your first step:</strong> Go to your dashboard, fill in the calculator, and get your personal daily calorie target.
          </p>
        </div>

        <!-- CTA -->
        <div style="text-align: center; margin: 28px 0;">
          <a href="https://www.dailybite.fit/dashboard" style="background: linear-gradient(160deg, #065F46 0%, #1D9E75 100%); color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">
            Go to My Dashboard &rarr;
          </a>
        </div>

        <p style="font-size: 14px; color: #333; line-height: 1.7;">
          Need help? Simply reply to this email — we're here for you.
        </p>

        <p style="font-size: 14px; color: #333; line-height: 1.7;">
          Here's to a healthier you,<br>
          <strong>The DailyBite Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
        <p style="font-size: 11px; color: #999; margin: 0;">
          &copy; 2026 DailyBite — All rights reserved.
        </p>
        <p style="font-size: 11px; color: #999; margin: 5px 0 0;">
          You received this email because you signed up at www.dailybite.fit
        </p>
        <p style="font-size: 11px; margin: 8px 0 0;">
          <a href="https://www.dailybite.fit" style="color: #1D9E75; text-decoration: none;">Website</a>
          &nbsp;&middot;&nbsp;
          <a href="mailto:${process.env.GMAIL_USER}?subject=Unsubscribe" style="color: #999; text-decoration: none;">Unsubscribe</a>
        </p>
      </div>
    </div>
  `;
}

async function sendWelcomeEmail(to, name, lang = "en") {
  const subject =
    lang === "he"
      ? "!ברוכה הבאה ל-DailyBite"
      : "Welcome to DailyBite — Let's get started!";

  const mailOptions = {
    from: `"DailyBite" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html: getEmailHTML(name, lang),
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendWelcomeEmail };
