
import { MessageSquare } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-lg shadow-lg mb-8">
      <div className="flex items-center space-x-3">
        <MessageSquare size={32} />
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Atendimento</h1>
          <p className="text-purple-100 mt-1">Métricas de avaliação dos grupos WhatsApp</p>
        </div>
      </div>
    </div>
  );
};
