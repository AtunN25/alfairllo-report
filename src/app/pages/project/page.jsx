import ProjectForm from "@/components/ProjectForm";
import DailyActivities from "@/components/DailyActivities";
import SafetyTalk from "@/components/SafetyTalk";
import Point from "@/components/Point";
import SafetyTalkSubtitleForm from "@/components/SafetyTalkSubtitleForm";


export default function ProjectPage() {
 
  return (
    <div className="bg-black h-screen text-white">
      <ProjectForm />
      <DailyActivities />
      <SafetyTalk />
      <Point />
      <SafetyTalkSubtitleForm />
    </div>
  );
}
