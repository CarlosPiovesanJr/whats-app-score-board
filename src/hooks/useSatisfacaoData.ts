
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SatisfacaoData {
  id: number;
  created_at: string;
  nota_convertida: number | null;
  avaliacao: string | null;
  grupo: string | null;
  usuario: string | null;
}

export const useSatisfacaoData = () => {
  return useQuery({
    queryKey: ['satisfacao'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('satisfacao')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar dados:', error);
        throw error;
      }

      console.log('Dados carregados:', data);
      return data as SatisfacaoData[];
    }
  });
};
