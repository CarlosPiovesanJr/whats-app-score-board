
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FormularioData {
  id: number;
  created_at: string;
  nota: number | null;
  name: string | null;
  email: string | null;
  phone: number | null;
  empresa: string | null;
  notes: string | null;
}

export const useFormularioData = () => {
  return useQuery({
    queryKey: ['formulario'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('formulario_suporte')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar dados do formulário:', error);
        throw error;
      }

      console.log('Dados do formulário carregados:', data);
      return data as FormularioData[];
    }
  });
};
