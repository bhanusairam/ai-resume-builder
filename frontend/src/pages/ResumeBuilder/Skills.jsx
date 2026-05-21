import DashboardLayout from "../../components/layouts/DashboardLayout";
import ModernTemplate from "../../templates/ModernTemplate";
import { useResume } from "../../context/ResumeContext";

export default function Skills() {
  const { resumeData } = useResume();

  return (
    <DashboardLayout preview={<ModernTemplate data={resumeData} />}>
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Skills</h2>
        {/* Your skill UI */}
      </div>
    </DashboardLayout>
  );
}