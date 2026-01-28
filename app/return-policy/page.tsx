import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">Return Policy</h1>
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">Returns and Exchanges</h2>
            <p className="mb-4">
              At RastaLife, we want you to be completely satisfied with your purchase. If for any reason you are not happy with your order, we offer a hassle-free return and exchange policy.
            </p>

            <h3 className="text-xl font-semibold mb-2">Return Conditions</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Items must be returned within 7 days of delivery</li>
              <li>Products must be unused, unwashed, and in original condition</li>
              <li>Original tags and packaging must be intact</li>
              <li>Return shipping costs are the responsibility of the customer</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">How to Return</h3>
            <ol className="list-decimal pl-6 mb-4">
              <li>Contact our customer service team</li>
              <li>Provide your order number and reason for return</li>
              <li>Pack the item securely in its original packaging</li>
              <li>Ship the item to our return address</li>
            </ol>

            <h3 className="text-xl font-semibold mb-2">Refund Process</h3>
            <p className="mb-4">
              Once we receive and inspect your returned item, we will process your refund within 5-7 business days. The refund will be issued to your original payment method.
            </p>

            <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
            <p>
              If you have any questions about our return policy, please contact us at info@rastalife.com or call +880 1XXX-XXXXXX.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
