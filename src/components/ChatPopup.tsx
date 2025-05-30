import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! Como posso ajudá-lo hoje?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://8401-186-249-194-39.ngrok-free.app/webhook/a0032740-26d8-491b-93f9-2250906d0e17/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            chatInput: inputText,
            sessionId: "usuario123", // ou algo dinâmico, ex: window.location.href, deviceId, userId
          }),
        }
      );

      const data = await response.json();
      console.log("Resposta da API:", data);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: (data.response ?? data.message ?? data.output ?? "Desculpe, não consegui processar sua mensagem.").replace(/^"|"$/g, ""),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Desculpe, ocorreu um erro. Tente novamente.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Botão flutuante */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg z-50"
            size="icon"
          >
            <MessageCircle size={24} className="text-white" />
          </Button>
        </DialogTrigger>

        {isOpen && (
          <div className="max-w-sm w-full h-[500px] flex flex-col fixed bottom-28 right-8 shadow-lg rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 z-50 overflow-hidden">
            <DialogHeader className="px-4 pt-4">
              <DialogTitle className="flex items-center gap-2">
                <MessageCircle size={20} />
                Assistente Virtual
              </DialogTitle>
            </DialogHeader>

            {/* Área de mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser
                        ? "bg-purple-600 text-white"
                        : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input de mensagem */}
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Digite sua mensagem..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputText.trim()}
                size="icon"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
};
