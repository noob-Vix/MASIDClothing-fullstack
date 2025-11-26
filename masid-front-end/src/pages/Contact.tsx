import React from "react";
import Header from "../components/Header";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-neutral-700 mb-4">
          We'd love to hear from you! Reach out using the information below or fill out our form.
        </p>

        <div className="flex flex-col gap-4">
          <p><strong>Email:</strong> support@shoefit.com</p>
          <p><strong>Phone:</strong> +63 912 345 6789</p>
          <p><strong>Address:</strong> 123 Street, City, Philippines</p>

          {/* Simple contact form */}
          <form className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Your Name"
              className="p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="p-2 border rounded"
            />
            <textarea
              placeholder="Your Message"
              className="p-2 border rounded"
              rows={4}
            />
            <button
              type="submit"
              className="bg-neutral-900 text-white px-4 py-2 rounded hover:bg-neutral-700"
            >
              Send
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
