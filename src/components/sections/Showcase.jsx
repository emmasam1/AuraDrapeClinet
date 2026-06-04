function Showcase() {
    const images = [
        "/female_shirt.png",
        "/male_trouser.png",
        "/male_shirt.png",
        "/female_skirt.png",
    ];

    return (
        <section id="showcase" className="py-32 px-6">
            <div className="text-center mb-20">
                <h2 className="text-4xl font-bold pt-10"> From Imagination to Reality  </h2>
                <h1 className="text-5xl font-bold pt-3"> Bring Your Design To Life </h1>
                <p className="l font-bold pt-2">Design, simulate, and animate your garments all in one place</p>
            </div>
            <div className="text-center mb-15">

                <h2 className="text-5xl font-bold">
                    3D Fashion <span className="gradient-text">Showcase</span>
                </h2>
            </div>

            <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className="overflow-hidden rounded-3xl group"
                    >
                        <img
                            src={img}
                            alt=""
                            className="group-hover:scale-110 transition duration-500"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Showcase