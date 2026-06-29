import MapEmbed from '../components/MapEmbed';
import CalendarWidget from '../components/CalendarWidget';
import { events } from '../content/events';

export default function HomeSection() {
  return (
    <section
      id="home"
      aria-labelledby="home-heading"
      className="py-16"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div className="mb-12 text-center">
          <h1
            id="home-heading"
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
          >
            Welcome to Community Club
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Your local hub
            for connection, activity, and community — bringing people together since 1985.
          </p>
        </div>

        {/* Map + Calendar */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">Find Us</h2>
            <MapEmbed />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Upcoming Events
            </h2>
            <CalendarWidget events={events} />
          </div>
        </div>
      </div>
    </section>
  );
}
