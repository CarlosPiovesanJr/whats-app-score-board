
import { DashboardHeader } from "@/components/DashboardHeader";
import { ChatPopup } from "@/components/ChatPopup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WhatsAppView } from "@/components/WhatsAppView";
import { NpsView } from "@/components/NpsView";

const Index = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardHeader />
        
        <div className="py-8">
          <Tabs defaultValue="whatsapp" className="w-full">
            <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <TabsTrigger 
                  value="whatsapp" 
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-medium"
                >
                  Grupos WhatsApp
                </TabsTrigger>
                <TabsTrigger 
                  value="nps"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-medium"
                >
                  Avaliações NPS
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="whatsapp" className="mt-0">
              <WhatsAppView />
            </TabsContent>
            
            <TabsContent value="nps" className="mt-0">
              <NpsView />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <ChatPopup />
    </div>
  );
};

export default Index;
