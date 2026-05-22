import { Link } from 'react-router-dom';
import Image1 from '../../../public/illustration.svg';

const PaymentError = () => {
  return (
    <section className="bg-[#eef0f4] min-h-screen flex items-center justify-center p-4">
      <div className="container px-6 py-12 mx-auto lg:flex lg:items-center lg:gap-12">
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <div className="neu-card max-w-lg mx-auto lg:mx-0 p-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Payment Failed
            </h1>
            <p className="text-[#6b7588] mb-2">
              Oops! It looks like your payment couldn't be processed. Please check your payment details and try again.
            </p>
            <p className="text-[#6b7588] mb-6">
              If the issue persists, feel free to contact our support team.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/checkout"
                className="neu-btn-primary px-6 py-3 text-sm font-medium"
              >
                Retry Payment
              </Link>
              <Link
                to="/"
                className="neu-btn px-6 py-3 text-sm font-medium text-[#6b7588]"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 mt-12 lg:mt-0">
          <img
            className="w-full max-w-lg mx-auto lg:mx-0"
            src={Image1}
            alt="Payment Failed Illustration"
          />
        </div>
      </div>
    </section>
  );
};

export default PaymentError;
