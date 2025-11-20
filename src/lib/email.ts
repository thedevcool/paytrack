import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendWelcomeEmail = async (userEmail: string, userName: string) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: userEmail,
    subject:
      "Welcome to PayTrack by Tini - Transform Your Learning Journey! 🚀",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: linear-gradient(145deg, #0f172a, #1e293b); color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
        
        <!-- Header with animated gradient -->
        <div style="background: linear-gradient(135deg, #0ea5e9, #3b82f6, #8b5cf6); padding: 40px 30px; text-align: center; position: relative;">
          <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 12px; padding: 20px; display: inline-block;">
            <h1 style="margin: 0; font-size: 32px; font-weight: 800; background: linear-gradient(45deg, #ffffff, #e0e7ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
              PayTrack by Tini
            </h1>
            <p style="margin: 8px 0 0; font-size: 18px; opacity: 0.95; font-weight: 500;">
              🎉 Welcome to Your Learning Journey!
            </p>
          </div>
        </div>
        
        <!-- Main content -->
        <div style="padding: 40px 30px;">
          <h2 style="background: linear-gradient(45deg, #0ea5e9, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-top: 0; font-size: 24px; font-weight: 700;">
            Hi ${userName}! 👋
          </h2>
          
          <p style="line-height: 1.8; color: #e2e8f0; font-size: 16px; margin-bottom: 25px;">
            Welcome to <strong style="color: #0ea5e9;">PayTrack by Tini</strong> - your smart companion for managing educational payments and tracking your learning progress! We're thrilled to have you join thousands of learners who are transforming their educational journey.
          </p>
          
          <!-- Feature highlights -->
          <div style="background: rgba(14, 165, 233, 0.1); border: 1px solid rgba(14, 165, 233, 0.2); border-radius: 12px; padding: 25px; margin: 30px 0;">
            <h3 style="color: #0ea5e9; margin-top: 0; font-size: 20px; font-weight: 600; margin-bottom: 20px;">
              ✨ What you can do with PayTrack:
            </h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin: 12px 0; color: #e2e8f0; display: flex; align-items: center;">
                <span style="background: linear-gradient(45deg, #10b981, #059669); border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 12px;">📚</span>
                <strong>Track Multiple Programs:</strong> Manage all your learning programs in one place
              </li>
              <li style="margin: 12px 0; color: #e2e8f0; display: flex; align-items: center;">
                <span style="background: linear-gradient(45deg, #3b82f6, #2563eb); border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 12px;">💳</span>
                <strong>Flexible Payments:</strong> Choose daily, weekly, monthly, or one-time payment schedules
              </li>
              <li style="margin: 12px 0; color: #e2e8f0; display: flex; align-items: center;">
                <span style="background: linear-gradient(45deg, #8b5cf6, #7c3aed); border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 12px;">🔒</span>
                <strong>Secure Payments:</strong> Bank-level security with Paystack integration
              </li>
              <li style="margin: 12px 0; color: #e2e8f0; display: flex; align-items: center;">
                <span style="background: linear-gradient(45deg, #f59e0b, #d97706); border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 12px;">📊</span>
                <strong>Progress Tracking:</strong> Visual progress bars and detailed payment history
              </li>
              <li style="margin: 12px 0; color: #e2e8f0; display: flex; align-items: center;">
                <span style="background: linear-gradient(45deg, #ef4444, #dc2626); border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 12px;">🔔</span>
                <strong>Smart Reminders:</strong> Never miss a payment with email notifications
              </li>
            </ul>
          </div>
          
          <!-- Getting started section -->
          <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1)); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 25px; margin: 30px 0;">
            <h3 style="color: #10b981; margin-top: 0; font-size: 20px; font-weight: 600; margin-bottom: 15px;">
              🚀 Ready to Get Started?
            </h3>
            <p style="color: #e2e8f0; margin-bottom: 20px; line-height: 1.6;">
              Create your first learning program and start tracking your educational investment. Whether it's a coding bootcamp, language course, or professional certification - we've got you covered!
            </p>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL}/dashboard" 
                 style="display: inline-block; 
                        background: linear-gradient(135deg, #0ea5e9, #3b82f6); 
                        color: white; 
                        text-decoration: none; 
                        padding: 16px 32px; 
                        border-radius: 12px; 
                        font-weight: 600; 
                        font-size: 16px; 
                        box-shadow: 0 10px 25px -3px rgba(14, 165, 233, 0.3);
                        transition: all 0.3s ease;">
                🎯 Go to Your Dashboard
              </a>
            </div>
          </div>
          
          <!-- Tips section -->
          <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 12px; padding: 25px; margin: 30px 0;">
            <h3 style="color: #8b5cf6; margin-top: 0; font-size: 18px; font-weight: 600; margin-bottom: 15px;">
              💡 Pro Tips for Success:
            </h3>
            <ul style="color: #e2e8f0; margin: 0; padding-left: 20px; line-height: 1.7;">
              <li style="margin-bottom: 8px;">Set up your payment schedule that fits your budget</li>
              <li style="margin-bottom: 8px;">Enable notifications to stay on track with payments</li>
              <li style="margin-bottom: 8px;">Monitor your progress regularly to stay motivated</li>
              <li style="margin-bottom: 8px;">Use the dashboard to manage multiple programs efficiently</li>
            </ul>
          </div>
          
          <p style="color: #94a3b8; font-size: 14px; margin-top: 40px; text-align: center; line-height: 1.6;">
            Questions? We're here to help! Simply reply to this email or visit our support center.<br>
            Happy learning! 🎓✨
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background: rgba(0, 0, 0, 0.3); padding: 25px 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1);">
          <p style="margin: 0; color: #94a3b8; font-size: 14px;">
            © 2024 PayTrack by Tini. Empowering learners worldwide.
          </p>
          <p style="margin: 8px 0 0; color: #64748b; font-size: 12px;">
            Transform your learning journey with smart payment tracking.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
};

export const sendPaymentReminder = async (
  userEmail: string,
  programName: string,
  amount: number,
  dueDate: string
) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: userEmail,
    subject: `Payment Reminder: ${programName} - ₦${amount.toLocaleString()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; color: white; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Payment Reminder</h1>
          <p style="margin: 10px 0 0; font-size: 16px;">PayTrack by Tini</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Hello!</h2>
          <p style="color: #666; line-height: 1.6;">
            This is a friendly reminder that you have an upcoming payment for your <strong>${programName}</strong> program.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Payment Details:</h3>
            <p style="margin: 5px 0;"><strong>Program:</strong> ${programName}</p>
            <p style="margin: 5px 0;"><strong>Amount:</strong> ₦${amount.toLocaleString()}</p>
            <p style="margin: 5px 0;"><strong>Due Date:</strong> ${dueDate}</p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            Please log in to your dashboard to make your payment and keep your program active.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      text-decoration: none; 
                      padding: 15px 30px; 
                      border-radius: 8px; 
                      font-weight: bold;
                      display: inline-block;">
              Make Payment Now
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; margin-top: 40px; text-align: center;">
            If you have any questions, please don't hesitate to contact us.
          </p>
        </div>
        
        <div style="text-align: center; color: #999; font-size: 12px;">
          © 2024 PayTrack by Tini. All rights reserved.
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Payment reminder sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending payment reminder:", error);
    throw error;
  }
};

export const sendAdminNotification = async (
  type:
    | "new_program"
    | "payment_made"
    | "program_auto_revoked"
    | "program_frozen"
    | "program_deleted",
  data: {
    userName: string;
    userEmail: string;
    programName: string;
    amount?: number;
    paymentReference?: string;
    reason?: string;
    missedPaymentDate?: string;
  }
) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER;

  // Define notification configurations
  const notifications = {
    new_program: {
      subject: `🆕 New Program Awaiting Approval - ${data.programName}`,
      title: "🆕 New Program Approval Needed",
      color: "#f59e0b, #d97706",
      emoji: "⏳",
      message:
        "This program is waiting for your approval before the user can start making payments.",
      cta: "🚀 Review & Approve Program",
    },
    payment_made: {
      subject: `💰 Payment Received - ${data.programName}`,
      title: "💰 Payment Received",
      color: "#10b981, #059669",
      emoji: "✅",
      message: "Payment has been successfully processed and recorded.",
      cta: "📊 View Dashboard",
    },
    program_auto_revoked: {
      subject: `🚨 Program Auto-Revoked - ${data.programName}`,
      title: "🚨 Program Automatically Revoked",
      color: "#ef4444, #dc2626",
      emoji: "⚠️",
      message: `Program automatically revoked due to: ${data.reason}`,
      cta: "🔍 Review Details",
    },
    program_frozen: {
      subject: `❄️ Program Frozen - ${data.programName}`,
      title: "❄️ Program Frozen for Missed Payment",
      color: "#3b82f6, #2563eb",
      emoji: "🧊",
      message: `Program frozen due to missed payment on ${data.missedPaymentDate}`,
      cta: "📋 Manage Program",
    },
    program_deleted: {
      subject: `🗑️ Program Deleted - ${data.programName}`,
      title: "🗑️ Program Deleted",
      color: "#ef4444, #dc2626",
      emoji: "🗑️",
      message: `Program has been permanently deleted by administrator.`,
      cta: "📊 View Dashboard",
    },
  };

  const config = notifications[type];

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: adminEmail,
    subject: config.subject,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(145deg, #1e293b, #334155); color: #ffffff; border-radius: 16px; overflow: hidden;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, ${
          config.color
        }); padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700;">
            ${config.title}
          </h1>
          <p style="margin: 8px 0 0; opacity: 0.9;">PayTrack by Tini - Admin Notification</p>
        </div>
        
        <!-- Main content -->
        <div style="padding: 30px;">          
          <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #0ea5e9; margin-top: 0; margin-bottom: 15px;">Details:</h3>
            <p style="margin: 8px 0; color: #e2e8f0;"><strong>User:</strong> ${
              data.userName
            }</p>
            <p style="margin: 8px 0; color: #e2e8f0;"><strong>Email:</strong> ${
              data.userEmail
            }</p>
            <p style="margin: 8px 0; color: #e2e8f0;"><strong>Program:</strong> ${
              data.programName
            }</p>
            ${
              type === "payment_made"
                ? `<p style="margin: 8px 0; color: #e2e8f0;"><strong>Amount:</strong> ₦${data.amount?.toLocaleString()}</p>`
                : ""
            }
            ${
              type === "payment_made"
                ? `<p style="margin: 8px 0; color: #e2e8f0;"><strong>Reference:</strong> ${data.paymentReference}</p>`
                : ""
            }
            ${
              data.reason
                ? `<p style="margin: 8px 0; color: #e2e8f0;"><strong>Reason:</strong> ${data.reason}</p>`
                : ""
            }
            ${
              data.missedPaymentDate
                ? `<p style="margin: 8px 0; color: #e2e8f0;"><strong>Missed Payment Date:</strong> ${data.missedPaymentDate}</p>`
                : ""
            }
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0; font-weight: 600;">${config.emoji} ${
      config.message
    }</p>
          </div>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="${process.env.NEXTAUTH_URL}/admin" 
               style="background: linear-gradient(135deg, ${config.color}); 
                      color: white; 
                      text-decoration: none; 
                      padding: 15px 30px; 
                      border-radius: 12px; 
                      font-weight: 600;
                      display: inline-block;
                      box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.3);">
              ${config.cta}
            </a>
          </div>
          
          <p style="color: #94a3b8; font-size: 14px; margin-top: 30px; text-align: center;">
            PayTrack Admin Dashboard - Stay informed about your platform activity
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Admin notification sent: ${type}`);
  } catch (error) {
    console.error("Error sending admin notification:", error);
    throw error;
  }
};

export const sendProgramApprovalNotification = async (
  userEmail: string,
  userName: string,
  programName: string,
  firstPaymentAmount: number
) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: userEmail,
    subject: `🎉 Program Approved - ${programName} | Start Making Payments`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: linear-gradient(145deg, #0f172a, #1e293b); color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
        
        <!-- Header with animated gradient -->
        <div style="background: linear-gradient(135deg, #10b981, #059669, #0ea5e9); padding: 40px 30px; text-align: center;">
          <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 12px; padding: 20px; display: inline-block;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: white;">
              🎉 Program Approved!
            </h1>
            <p style="margin: 8px 0 0; font-size: 16px; opacity: 0.95; font-weight: 500;">
              Your learning journey begins now
            </p>
          </div>
        </div>
        
        <!-- Main content -->
        <div style="padding: 40px 30px;">
          <h2 style="background: linear-gradient(45deg, #10b981, #0ea5e9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-top: 0; font-size: 24px; font-weight: 700;">
            Hi ${userName}! 👋
          </h2>
          
          <p style="line-height: 1.8; color: #e2e8f0; font-size: 16px; margin-bottom: 25px;">
            Great news! Your <strong style="color: #10b981;">${programName}</strong> program has been approved and is now active. You can start making payments according to your chosen schedule.
          </p>
          
          <!-- Payment info -->
          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 25px; margin: 30px 0;">
            <h3 style="color: #10b981; margin-top: 0; font-size: 20px; font-weight: 600; margin-bottom: 20px;">
              💳 Payment Information:
            </h3>
            <div style="grid-template-columns: 1fr 1fr; gap: 15px; display: grid;">
              <div>
                <p style="margin: 8px 0; color: #e2e8f0;"><strong>First Payment:</strong> ₦${firstPaymentAmount.toLocaleString()}</p>
                <p style="margin: 8px 0; color: #e2e8f0;"><strong>Payment Schedule:</strong> Start anytime</p>
              </div>
              <div>
                <p style="margin: 8px 0; color: #e2e8f0;"><strong>Program:</strong> ${programName}</p>
                <p style="margin: 8px 0; color: #e2e8f0;"><strong>Status:</strong> <span style="color: #10b981;">Active</span></p>
              </div>
            </div>
          </div>
          
          <!-- CTA Section -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard" 
               style="display: inline-block; 
                      background: linear-gradient(135deg, #10b981, #059669); 
                      color: white; 
                      text-decoration: none; 
                      padding: 16px 32px; 
                      border-radius: 12px; 
                      font-weight: 600; 
                      font-size: 16px; 
                      box-shadow: 0 10px 25px -3px rgba(16, 185, 129, 0.3);
                      transition: all 0.3s ease;">
              💰 Make Your First Payment
            </a>
          </div>
          
          <p style="color: #94a3b8; font-size: 14px; margin-top: 40px; text-align: center; line-height: 1.6;">
            Ready to start your learning journey? Head to your dashboard to make your first payment and begin tracking your progress!<br>
            Happy learning! 🎓✨
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background: rgba(0, 0, 0, 0.3); padding: 25px 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1);">
          <p style="margin: 0; color: #94a3b8; font-size: 14px;">
            © 2024 PayTrack by Tini. Empowering learners worldwide.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Program approval notification sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending approval notification:", error);
    throw error;
  }
};

export const sendPaymentConfirmation = async (
  userEmail: string,
  userName: string,
  programName: string,
  amount: number,
  reference: string
) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: userEmail,
    subject: `✅ Payment Confirmed - ${programName}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(145deg, #0f172a, #1e293b); color: #ffffff; border-radius: 16px; overflow: hidden;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: white;">
            ✅ Payment Successful!
          </h1>
          <p style="margin: 8px 0 0; opacity: 0.9;">PayTrack by Tini</p>
        </div>
        
        <!-- Main content -->
        <div style="padding: 30px;">
          <h2 style="color: #e2e8f0; margin-top: 0; font-size: 20px;">
            Hi ${userName}! 🎉
          </h2>
          
          <p style="line-height: 1.8; color: #e2e8f0; font-size: 16px; margin-bottom: 25px;">
            Your payment for <strong style="color: #10b981;">${programName}</strong> has been successfully processed. Keep up the great work on your learning journey!
          </p>
          
          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #10b981; margin-top: 0; margin-bottom: 15px;">Payment Details:</h3>
            <p style="margin: 8px 0; color: #e2e8f0;"><strong>Program:</strong> ${programName}</p>
            <p style="margin: 8px 0; color: #e2e8f0;"><strong>Amount:</strong> ₦${amount.toLocaleString()}</p>
            <p style="margin: 8px 0; color: #e2e8f0;"><strong>Reference:</strong> ${reference}</p>
            <p style="margin: 8px 0; color: #e2e8f0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard" 
               style="background: linear-gradient(135deg, #10b981, #059669); 
                      color: white; 
                      text-decoration: none; 
                      padding: 15px 30px; 
                      border-radius: 12px; 
                      font-weight: 600;
                      display: inline-block;">
              📊 View Your Progress
            </a>
          </div>
          
          <p style="color: #94a3b8; font-size: 14px; margin-top: 30px; text-align: center;">
            Thank you for staying committed to your learning goals! 🚀
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Payment confirmation sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending payment confirmation:", error);
    throw error;
  }
};
