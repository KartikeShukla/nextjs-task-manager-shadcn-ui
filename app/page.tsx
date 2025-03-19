import Link from "next/link";
import { ArrowRight, Scale, BookOpen, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-12 sm:py-20 lg:py-24 text-center sm:text-left flex flex-col sm:flex-row items-center">
          <div className="sm:w-1/2 mb-8 sm:mb-0 max-w-xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Expert Arbitration Services for Complex Disputes
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              We provide professional dispute resolution services to help businesses and individuals 
              resolve conflicts efficiently and effectively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-blue-700 hover:bg-blue-800">
                <Link href="/leads">Contact Us</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="sm:w-1/2 flex justify-center sm:justify-end">
            <div className="w-full max-w-md">
              <img 
                src="/images/arbitration.svg" 
                alt="Arbitration Services Illustration" 
                className="w-full"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/500x400?text=Arbitration+Institute";
                }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a wide range of dispute resolution services tailored to meet your specific needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Scale className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Commercial Arbitration</h3>
              <p className="text-gray-600 mb-4">
                Resolve commercial disputes efficiently with our expert arbitrators.
              </p>
              <Link href="#" className="text-blue-700 font-medium flex items-center hover:underline">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-green-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mediation</h3>
              <p className="text-gray-600 mb-4">
                Facilitate negotiations and find mutually acceptable solutions to conflicts.
              </p>
              <Link href="#" className="text-blue-700 font-medium flex items-center hover:underline">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-purple-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Contract Review</h3>
              <p className="text-gray-600 mb-4">
                Expert analysis and review of contracts to prevent future disputes.
              </p>
              <Link href="#" className="text-blue-700 font-medium flex items-center hover:underline">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-orange-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Legal Consultation</h3>
              <p className="text-gray-600 mb-4">
                Get expert legal advice on dispute resolution options and strategies.
              </p>
              <Link href="#" className="text-blue-700 font-medium flex items-center hover:underline">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Resolve Your Dispute?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Our team of experienced arbitrators and mediators is ready to help you find a solution.
          </p>
          <Button asChild size="lg" variant="outline" className="bg-white text-blue-700 hover:bg-blue-50 border-white">
            <Link href="/leads">Contact Us Today</Link>
          </Button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Read about the experiences of businesses and individuals who have used our services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "The arbitration process was smooth and efficient. The arbitrator was knowledgeable and fair, and we were able to resolve our dispute in a timely manner."
              </p>
              <div className="font-medium">
                <p className="text-gray-900">Sarah Johnson</p>
                <p className="text-gray-500 text-sm">CEO, Johnson Enterprises</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "We were able to avoid lengthy and costly litigation thanks to the mediation services provided. The mediator was professional and helped us reach a mutually beneficial agreement."
              </p>
              <div className="font-medium">
                <p className="text-gray-900">Michael Chen</p>
                <p className="text-gray-500 text-sm">Legal Director, Tech Innovations</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "The contract review service helped us identify potential issues before they became problems. The detailed feedback was invaluable and has saved us from future disputes."
              </p>
              <div className="font-medium">
                <p className="text-gray-900">Emily Rodriguez</p>
                <p className="text-gray-500 text-sm">COO, Global Solutions</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
