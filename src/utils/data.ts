/**
 * Formata uma data ISO em um rótulo relativo curto, no padrão
 * usado pelo Mail da Apple ("Hoje", "Ontem", "26/09", ...).
 */
export function formatarDataRelativa(dataISO: string): string {
  const data = new Date(dataISO);
  const agora = new Date();

  const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const inicioData = new Date(data.getFullYear(), data.getMonth(), data.getDate());

  const diffDias = Math.round(
    (inicioHoje.getTime() - inicioData.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDias === 0) {
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  if (diffDias === 1) {
    return 'Ontem';
  }

  if (diffDias < 7) {
    return data.toLocaleDateString('pt-BR', { weekday: 'short' });
  }

  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

/** Formata uma data ISO por extenso, para o cabeçalho do chamado aberto. */
export function formatarDataCompleta(dataISO: string): string {
  const data = new Date(dataISO);
  const hoje = new Date();
  const ontem = new Date(hoje);
  ontem.setDate(hoje.getDate() - 1);

  const mesmodia = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  if (mesmodia(data, hoje)) return `Hoje às ${hora}`;
  if (mesmodia(data, ontem)) return `Ontem às ${hora}`;

  return `${data.toLocaleDateString('pt-BR')} às ${hora}`;
}

/** Gera as iniciais de um nome, para usar no avatar (ex.: "Nathane de Castro" -> "NC"). */
export function obterIniciais(nomeCompleto: string): string {
  const partes = nomeCompleto.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}
