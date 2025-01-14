import {
  BarChart3,
  Bell,
  CreditCard,
  LineChart,
  PiggyBank,
  Wallet,
} from 'lucide-react'

const features = [
  {
    title: 'Expense Tracking',
    description:
      'Easily track your daily expenses and income with our intuitive interface.',
    icon: Wallet,
  },
  {
    title: 'Budget Management',
    description:
      'Set and monitor budgets for different categories to stay on track.',
    icon: PiggyBank,
  },
  {
    title: 'Transaction History',
    description:
      'View and analyze your complete transaction history with powerful filters.',
    icon: CreditCard,
  },
  {
    title: 'Visual Analytics',
    description:
      'Understand your spending patterns with beautiful charts and graphs.',
    icon: BarChart3,
  },
  {
    title: 'Smart Notifications',
    description:
      'Get timely alerts for bill payments and budget thresholds.',
    icon: Bell,
  },
  {
    title: 'Financial Reports',
    description:
      'Generate detailed reports to track your financial progress over time.',
    icon: LineChart,
  },
]

export function FeatureSection() {
  return (
    <div className="py-24 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight">
            Everything you need to manage your money
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            Powerful features to help you take control of your finances
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="relative p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
                <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
