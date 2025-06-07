import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  stats = [
    {
      title: "Active Users",
      value: "1,234",
      icon: "people",
      color: "green",
      description: "Currently online and engaged",
    },
    {
      title: "Monthly Reports",
      value: "56",
      icon: "assessment",
      color: "purple",
      description: "Generated this month",
    },
    {
      title: "Today's Logins",
      value: "89",
      icon: "login",
      color: "green",
      description: "Successful authentications",
    },
    {
      title: "Connected Systems",
      value: "12",
      icon: "devices",
      color: "purple",
      description: "Integrated platforms",
    },
  ]

  features = [
    {
      title: "Advanced Security",
      icon: "security",
      description:
        "Enterprise-grade security with multi-layer protection, JWT authentication, and real-time threat monitoring.",
      items: [
        "Two-factor authentication",
        "End-to-end encryption",
        "Real-time security monitoring",
        "Compliance with industry standards",
      ],
    },
    {
      title: "Data Analytics",
      icon: "analytics",
      description:
        "Comprehensive analytics suite with interactive dashboards, custom reports, and predictive insights.",
      items: [
        "Real-time data visualization",
        "Custom report generation",
        "Predictive analytics",
        "Export capabilities",
      ],
    },
    {
      title: "High Performance",
      icon: "speed",
      description: "Optimized for speed and reliability with cloud infrastructure and intelligent caching systems.",
      items: ["99.9% uptime guarantee", "Lightning-fast load times", "Scalable architecture", "Global CDN support"],
    },
  ]

  steps = [
    {
      title: "Sign Up",
      icon: "👤",
      description:
        "Create your account in seconds with our streamlined registration process. No credit card required for the free trial.",
    },
    {
      title: "Configure",
      icon: "⚙️",
      description:
        "Set up your workspace with our intuitive configuration wizard. Customize settings to match your business needs.",
    },
    {
      title: "Import Data",
      icon: "📊",
      description:
        "Easily import your existing data using our migration tools or connect to your current systems via API.",
    },
    {
      title: "Start Managing",
      icon: "🚀",
      description:
        "Begin managing your users, generating reports, and gaining insights from day one with our comprehensive platform.",
    },
  ]

  benefits = [
    {
      title: "Cost Effective",
      icon: "💰",
      description:
        "Reduce operational costs by up to 40% with our efficient automation tools and streamlined workflows.",
    },
    {
      title: "Time Saving",
      icon: "⏰",
      description: "Save hours every week with automated reporting, bulk operations, and intelligent task management.",
    },
    {
      title: "Scalable Solution",
      icon: "📈",
      description:
        "Grow your business without limits. Our platform scales seamlessly from small teams to enterprise organizations.",
    },
    {
      title: "24/7 Support",
      icon: "🛟",
      description: "Get help when you need it with our round-the-clock customer support and extensive documentation.",
    },
    {
      title: "Easy Integration",
      icon: "🔗",
      description: "Connect with your existing tools and systems using our robust API and pre-built integrations.",
    },
    {
      title: "Mobile Ready",
      icon: "📱",
      description: "Access your dashboard anywhere, anytime with our responsive design and mobile applications.",
    },
  ]

  testimonials = [
    {
      text: "This platform has revolutionized how we manage our user base. The analytics are incredibly detailed and the interface is intuitive. Our team productivity has increased by 60% since implementation.",
      name: "Sarah Johnson",
      position: "CTO at TechCorp",
      initials: "SJ",
    },
    {
      text: "The security features are top-notch and the customer support is exceptional. We've been using this system for 2 years and it has never let us down. Highly recommended for enterprise use.",
      name: "Michael Chen",
      position: "IT Director at GlobalSoft",
      initials: "MC",
    },
    {
      text: "Implementation was smooth and the ROI was immediate. The reporting capabilities have given us insights we never had before. It's an essential tool for any growing business.",
      name: "Emily Rodriguez",
      position: "Operations Manager at StartupXYZ",
      initials: "ER",
    },
  ]

  faqs = [
    {
      question: "How secure is the platform?",
      answer:
        "Our platform uses enterprise-grade security including AES-256 encryption, multi-factor authentication, and regular security audits. We comply with SOC 2, GDPR, and other industry standards.",
    },
    {
      question: "Can I integrate with existing systems?",
      answer:
        "Yes! We offer comprehensive APIs and pre-built integrations with popular tools like Salesforce, Slack, Microsoft Office, and many others. Our technical team can assist with custom integrations.",
    },
    {
      question: "What kind of support do you provide?",
      answer:
        "We provide 24/7 customer support via chat, email, and phone. Enterprise customers also get dedicated account managers and priority support with guaranteed response times.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes, we offer a 30-day free trial with full access to all features. No credit card required to start, and you can upgrade or cancel anytime during the trial period.",
    },
    {
      question: "How does pricing work?",
      answer:
        "Our pricing is based on the number of users and features you need. We offer flexible plans from small teams to enterprise organizations, with custom pricing for large deployments.",
    },
    {
      question: "Can I export my data?",
      answer:
        "You own your data and can export it anytime in various formats including CSV, JSON, and XML. We also provide migration assistance if you decide to switch platforms.",
    },
  ]
}
