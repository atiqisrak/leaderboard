import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Feed from "./components/Feed";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#181b20] text-white">
      <Navbar />
      <Hero />
      <Feed />

      <section id="community" className="py-12 bg-[#23262b] my-8 rounded-2xl">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-4 text-[#FCB813]">
            About Our Community
          </h2>
          <p className="text-[#b0b3b8] text-lg">
            Life @ EtherTech is a space for employees to share moments, ideas,
            and achievements. Whether it's a team event, a project milestone, or
            just a fun lunch, this is your place to connect and celebrate
            together.
          </p>
        </div>
      </section>

      <section id="about" className="py-12 bg-[#23262b] my-8 rounded-2xl">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-4 text-[#FCB813]">
            About Life @ EtherTech
          </h2>
          <p className="text-[#b0b3b8] text-lg">
            This is an internal social platform for EtherTech employees. All
            posts and interactions are by and for our team. Be kind, be
            creative, and have fun!
          </p>
        </div>
      </section>

      <footer className="bg-[#181b20] py-12 mt-8">
        <div className="max-w-3xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <Image
                src="/logo.svg"
                alt="EtherTech Logo"
                className="h-9 mb-4"
                width={150}
                height={100}
              />
            </div>
            <div>
              <h4 className="text-[#FCB813] text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#feed"
                    className="text-[#b0b3b8] hover:text-[#FCB813] transition-colors"
                  >
                    Feed
                  </a>
                </li>
                <li>
                  <a
                    href="#community"
                    className="text-[#b0b3b8] hover:text-[#FCB813] transition-colors"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="text-[#b0b3b8] hover:text-[#FCB813] transition-colors"
                  >
                    About
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#FCB813] text-lg mb-4">Connect</h4>
              <div className="flex gap-4 text-2xl">
                <a
                  href="#"
                  className="text-[#FCB813] hover:text-[#ffd34d] transition-colors"
                >
                  <i className="fab fa-linkedin"></i>
                </a>
                <a
                  href="#"
                  className="text-[#FCB813] hover:text-[#ffd34d] transition-colors"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href="#"
                  className="text-[#FCB813] hover:text-[#ffd34d] transition-colors"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-[#FCB813]/10">
            <p className="text-[#b0b3b8] text-sm">
              &copy; 2025 Life @ EtherTech. For the community, by the community.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
