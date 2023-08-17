import { useFormik } from "formik";
import * as Yup from "yup";

function App() {
  const validationSchema = Yup.object({
    phone: Yup.string()
      .required("Phone number is required")
      .min(10, "Must be 10 characters")
      .max(10, "Must be 10 characters"),
    amount: Yup.number().required("Enter amount"),
  });

  const formik = useFormik({
    initialValues: {
      phone: "",
      amount: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-5">
          Pay with <span className="text-green-600 font-bold">Mpesa</span>
        </h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-600">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              {...formik.getFieldProps("phone")}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-green-500"
            />
            {formik.touched.phone && formik.errors.phone ? (
              <div className="text-red-600">{formik.errors.phone}</div>
            ) : null}
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-600">
              Amount
            </label>
            <input
              type="text"
              id="amount"
              name="amount"
              {...formik.getFieldProps("amount")}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-green-500"
            />
            {formik.touched.amount && formik.errors.amount ? (
              <div className="text-red-600">{formik.errors.amount}</div>
            ) : null}
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Pay
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
