import Layout from './components/Layout';
import HomeSection from './sections/HomeSection';
import ScheduleSection from './sections/ScheduleSection';
import AboutSection from './sections/AboutSection';
import MembershipSection from './sections/MembershipSection';
import ClassesSection from './sections/ClassesSection';
import ShopSection from './sections/ShopSection';

export default function App() {
  return (
    <Layout>
      <HomeSection />
      <ScheduleSection />
      <AboutSection />
      <MembershipSection />
      <ClassesSection />
      <ShopSection />
    </Layout>
  );
}
