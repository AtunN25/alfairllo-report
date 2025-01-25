import ProjectForm from "@/components/ProjectForm";
import DailyActivities from "@/components/DailyActivities";
import SafetyTalk from "@/components/SafetyTalk";
import Point from "@/components/Point";
import SafetyTalkSubtitleForm from "@/components/SafetyTalkSubtitleForm";
import Well from "@/components/Well";
import Loggeo from "@/components/Loggeo";
import Cut from "@/components/Cut";
import SamplySurvey from "@/components/SamplySurvey";
import LabShipment from "@/components/LabShipment";
import SampleShipmentForm from "@/components/SampleShipmentForm";

import Reception from "@/components/Reception/Reception";
import RqdForm from "@/components/Reception/RqdForm";
import SusceptibilityForm from "@/components/Reception/SusceptibilityForm";
import PhotographForm from "@/components/Reception/PhotographForm";
import Regularized from "@/components/Reception/Regularized";
import TestTubesMetersForm from "@/components/Reception/TestTubesMetersForm";


export default function ProjectPage() {

  return (
    <div className="bg-black h-screen text-white">
      <h1 className="text-blue-600 font-bold text-6xl"> Project </h1>
      <ProjectForm />
      <DailyActivities />
      <SafetyTalk />
      <Point />
      <SafetyTalkSubtitleForm />

      <h1 className="text-blue-600 font-bold text-6xl"> Well </h1>
      <Well />
      <Loggeo />
      <Cut />
      <SamplySurvey />
      <LabShipment />
      <SampleShipmentForm />

      <h1 className="text-blue-600 font-bold text-6xl"> Reception </h1>

      <Reception />
      <RqdForm />
      <SusceptibilityForm />
      <PhotographForm />
      <Regularized />
      <TestTubesMetersForm />


    </div>
  );
}
