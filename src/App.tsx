import Layout from './components/Layout';
import HomeSection from './sections/HomeSection';
import AboutSection from './sections/AboutSection';
import MembershipSection from './sections/MembershipSection';
import ClassesSection from './sections/ClassesSection';

export default function App() {
  return (
    <Layout>
      <HomeSection />
      <AboutSection />
      <MembershipSection />
      <ClassesSection />
    </Layout>
  );
}
