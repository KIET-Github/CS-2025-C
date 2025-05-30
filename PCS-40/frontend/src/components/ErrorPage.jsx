import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <section className="bg-[#e4e6e6]">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <div className="flex justify-center -mt-14">
            {/* <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">404</h1> */}
            <iframe
              className="h-72 "
              src="https://lottie.host/embed/c4b333e1-2456-44a5-8044-279f63dc7a0f/vUXfOxRh8N.json"
            ></iframe>
          </div>
          <p className="mb-4 text-3xl tracking-tight font-bold md:text-4xl text-slate-700 -mt-14 " style={{ color: 'rgb(150, 120, 200)' }}>
            This Page is not available
          </p>
          <p className="mb-4 text-lg font-light text-gray-600 dark:text-gray-600">
            Sorry, we can't find that page. You'll find lots to explore on the
            home page.{" "}
          </p>
          <Link
            to="/"
            className="inline-flex bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
