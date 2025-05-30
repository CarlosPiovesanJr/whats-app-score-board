
import { DashboardHeader } from "@/components/DashboardHeader";
import { ChatPopup } from "@/components/ChatPopup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WhatsAppView } from "@/components/WhatsAppView";
import { NpsView } from "@/components/NpsView";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 p-4">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />
        
        {/* Tabs para alternar entre as visualizações */}
        <Tabs defaultValue="whatsapp" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="whatsapp">Grupos WhatsApp</TabsTrigger>
            <TabsTrigger value="nps">Avaliações NPS</TabsTrigger>
          </TabsList>
          
          <TabsContent value="whatsapp">
            <WhatsAppView />
          </TabsContent>
          
          <TabsContent value="nps">
            <NpsView />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Chat popup */}
      <ChatPopup />
    </div>
  );
};

export default Index;
