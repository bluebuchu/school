import Hero from '@/components/Hero';
import Members from '@/components/Members';
import MeetingRecords from '@/components/MeetingRecords';
import GoalsDashboard from '@/components/GoalsDashboard';
import ContactBoard from '@/components/ContactBoard';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Members />
      <MeetingRecords />
      <GoalsDashboard />
      <ContactBoard />
    </main>
  );
}