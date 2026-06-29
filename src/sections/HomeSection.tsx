import VideoHero from '../components/VideoHero';
import MapEmbed from '../components/MapEmbed';
import CalendarWidget from '../components/CalendarWidget';
import { events } from '../content/events';

export default function HomeSection() {
  return (
    <section id="home" aria-labelledby="hero-heading">
      {/* Full-screen video hero — h1#hero-heading lives inside VideoHero */}
      <VideoHero />

      {/* Map + Calendar */}
      <div className="bg-track py-16 racing-stripe">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-3">Find Us</p>
              <MapEmbed />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-3">Schedule</p>
              <CalendarWidget events={events} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
