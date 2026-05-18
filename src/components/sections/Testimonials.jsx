export default function Testimonials() {
  return (
    <section className="py-32 px-6">
      <div className="text-center mb-20">
        <h2 className="text-5xl font-bold">
          What Designers Say
        </h2>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        {[1,2,3].map((item) => (
          <div key={item} className="glass p-8 rounded-3xl">
            <p className="text-gray-300">
              “This platform transformed how we preview
              and simulate garments digitally.”
            </p>
            

            <div className="mt-6">
              <h4 className="font-bold">Fashion Designer</h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}