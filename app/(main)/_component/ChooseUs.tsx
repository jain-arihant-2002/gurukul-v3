import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, ShieldCheck, Rocket } from "lucide-react";

const features = [
	{
		icon: <BookOpen className="w-8 h-8 text-primary mb-4" />,
		title: "Expert-Led Courses",
		description:
			"Learn from industry professionals with real-world experience and up-to-date knowledge.",
	},
	{
		icon: <Users className="w-8 h-8 text-primary mb-4" />,
		title: "Vibrant Community",
		description:
			"Join a supportive network of learners and educators, collaborate and grow together.",
	},
	{
		icon: <ShieldCheck className="w-8 h-8 text-primary mb-4" />,
		title: "Secure & Private",
		description:
			"Your data and progress are protected with enterprise-grade security and privacy standards.",
	},
	{
		icon: <Rocket className="w-8 h-8 text-primary mb-4" />,
		title: "Fast Progress",
		description:
			"Track your learning, set goals, and accelerate your journey with our intuitive tools.",
	},
];

export default function ChooseUs() {
	return (
		<section className="py-16 bg-background">
			<div className="w-[80%] mx-auto px-4">
				<h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
					Why Choose{" "}
					<span className="text-primary">Us?</span>
				</h2>
				<p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
					Discover what makes Gurukul the best choice for your learning journey.
				</p>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{features.map((feature, idx) => (
						<Card
							key={idx}
							className="flex flex-col items-center text-center shadow-none border-muted bg-muted/40 hover:shadow-lg transition-shadow"
						>
							<CardHeader className="flex flex-col items-center">
								{feature.icon}
								<CardTitle className="text-lg font-semibold whitespace-nowrap">
									{feature.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground text-sm">
									{feature.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}