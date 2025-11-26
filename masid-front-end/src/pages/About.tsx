import Header from "../components/Header";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">About Us</h1>
        <p className="text-neutral-700 mb-4">
          ShoeFit is a brand dedicated to high-quality shoes for everyone.
          Our mission is to combine style, comfort, and affordability, so you can express yourself
          confidently every day.
        </p>
        <p className="text-neutral-700">
          We believe in sustainability, fair production practices, and bringing unique designs
          that our customers love. Thank you for choosing ShoeFit!
        </p>
      </main>
    </>
  );
}
