"use client";
import Image from 'next/image';
import React, { useState, useEffect, useCallback } from 'react';

interface Jogador {
  id: number;
  nome: string;
  nota: number;
  isAvulso?: boolean;
  isEditandoNome?: boolean;
  isEditandoNota?: boolean;
}

interface Time {
  id: string; 
  nome: string;
  cor: string;
  jogadores: Jogador[];
  media: number;
}

interface JogadorGlobal extends Jogador {
  status: 'sem_time' | 'em_time_verde' | 'em_time_vermelho' | 'em_time_cinza' | 'em_time_amarelo' | 'ausente';
  originalmenteSelecionado: boolean;
  timeId?: string; 
}

const jogadoresBaseIniciais: Jogador[] = [
  { id: 1, nome: 'Dente', nota: 2 },
  { id: 2, nome: 'Matsuura', nota: 4 },
  { id: 3, nome: 'Russo', nota: 3 },
  { id: 4, nome: 'Jordan', nota: 2 },
  { id: 5, nome: 'Thiago', nota: 5 },
  { id: 6, nome: 'Jubao', nota: 3 },
  { id: 7, nome: 'Igor', nota: 4 },
  { id: 8, nome: 'Gracco', nota: 1 },
  { id: 9, nome: 'Beligol', nota: 1 },
  { id: 10, nome: 'Ale', nota: 3 },
  { id: 11, nome: 'Jonas', nota: 3 },
  { id: 12, nome: 'Leo', nota: 4 },
  { id: 13, nome: 'Fuinha', nota: 4 },
  { id: 14, nome: 'Abel', nota: 4 },
  { id: 15, nome: 'Vitor', nota: 5 },
  { id: 16, nome: 'Adriano', nota: 3 },
  { id: 17, nome: 'Poneis', nota: 3 },
  { id: 18, nome: 'Samir', nota: 5 },
  { id: 19, nome: 'Boy', nota: 5 },
  { id: 20, nome: 'Magaiver', nota: 4 },
  { id: 21, nome: 'Caio', nota: 3 },
  { id: 22, nome: 'Gu Borges', nota: 2 },
  { id: 23, nome: 'Zé', nota: 4 },
  { id: 24, nome: 'Rapha', nota: 1 },
];

const jogadoresAvulsosIniciais: Jogador[] = Array.from({ length: 6 }, (_, i) => ({
  id: 25 + i,
  nome: `Avulso ${i + 1}`,
  nota: 3, 
  isAvulso: true,
}));

const todosJogadoresIniciais: Jogador[] = [...jogadoresBaseIniciais, ...jogadoresAvulsosIniciais].sort((a, b) => {
  if (a.isAvulso && !b.isAvulso) return 1;
  if (!a.isAvulso && b.isAvulso) return -1;
  return b.nota - a.nota || a.nome.localeCompare(b.nome);
});

const CORES_TIMES_CONFIG = [
  { id: "time_verde", nome: "Verde", corHex: "bg-green-600", corTexto: "text-green-100", statusJogador: 'em_time_verde' as JogadorGlobal['status'] },
  { id: "time_vermelho", nome: "Vermelho", corHex: "bg-red-600", corTexto: "text-red-100", statusJogador: 'em_time_vermelho' as JogadorGlobal['status'] },
  { id: "time_cinza", nome: "Cinza", corHex: "bg-gray-600", corTexto: "text-gray-100", statusJogador: 'em_time_cinza' as JogadorGlobal['status'] },
  { id: "time_amarelo", nome: "Amarelo", corHex: "bg-yellow-500", corTexto: "text-yellow-900", statusJogador: 'em_time_amarelo' as JogadorGlobal['status'] },
];

const ADMIN_CODE = "raphaeljogador";
const COOLDOWN_SECONDS = 30 * 60;
const MIN_JOGADORES_SORTEIO = 10;
const MAX_JOGADORES_SORTEIO = 20; 

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function calcularMediaTime(time: Jogador[]): number {
  if (!time || time.length === 0) return 0;
  const somaNotas = time.reduce((acc, jogador) => acc + jogador.nota, 0);
  return parseFloat((somaNotas / time.length).toFixed(2));
}

function isTimeValid(time: Jogador[]): boolean {
  const countNota1 = time.filter(j => j.nota === 1).length;
  const countNota5 = time.filter(j => j.nota === 5).length;
  return countNota1 <= 1 && countNota5 <= 1;
}

function sortearTimesEquilibrados(jogadoresSelecionadosParaSorteio: Jogador[]): Time[] {
  const n_jogadores = jogadoresSelecionadosParaSorteio.length;
  if (n_jogadores < MIN_JOGADORES_SORTEIO || n_jogadores > MAX_JOGADORES_SORTEIO) return [];

  const max_times_permitido = 4;
  const jogadores_por_time_ideal = 5;
  const tamanhos_dos_times_calculado: number[] = [];

  if (n_jogadores > 0) {
    const times_completos_de_5 = Math.floor(n_jogadores / jogadores_por_time_ideal);
    const jogadores_no_ultimo_time = n_jogadores % jogadores_por_time_ideal;

    if (times_completos_de_5 >= max_times_permitido) {
        const base = Math.floor(n_jogadores / max_times_permitido);
        const extra = n_jogadores % max_times_permitido;
        for (let i = 0; i < max_times_permitido; i++) {
            tamanhos_dos_times_calculado.push(base + (i < extra ? 1 : 0));
        }
    } else {
        for (let i = 0; i < times_completos_de_5; i++) {
            tamanhos_dos_times_calculado.push(jogadores_por_time_ideal);
        }
        if (jogadores_no_ultimo_time > 0) {
            tamanhos_dos_times_calculado.push(jogadores_no_ultimo_time);
        }
    }
    if (tamanhos_dos_times_calculado.length === 0 && n_jogadores > 0) { 
        tamanhos_dos_times_calculado.push(n_jogadores);
    }
  }
  
  const numeroDeTimesFinal = tamanhos_dos_times_calculado.length;
  if (numeroDeTimesFinal === 0) return [];

  let melhorCombinacaoDeTimes: Jogador[][] = [];
  let menorDiferencaMedias = Infinity;
  let tentativas = 0;

  while (tentativas < 800) { 
    const jogadoresParaDistribuir = shuffleArray([...jogadoresSelecionadosParaSorteio]);
    const timesAtuais: Jogador[][] = Array.from({ length: numeroDeTimesFinal }, () => []);
    let currentPlayerIndex = 0;
    for (let i = 0; i < numeroDeTimesFinal; i++) {
        for (let j = 0; j < tamanhos_dos_times_calculado[i]; j++) {
            if (currentPlayerIndex < jogadoresParaDistribuir.length) {
                timesAtuais[i].push(jogadoresParaDistribuir[currentPlayerIndex++]);
            }
        }
    }
    const distribuicaoCorreta = timesAtuais.every((time, idx) => time.length === tamanhos_dos_times_calculado[idx]);
    if (!distribuicaoCorreta) {
        tentativas++;
        continue;
    }
    
    for (let iter = 0; iter < 50; iter++) { 
      const mediasTimes = timesAtuais.map(t => calcularMediaTime(t));
      let idxMaiorMedia = -1, idxMenorMedia = -1;
      let maiorMedia = -Infinity, menorMedia = Infinity;

      mediasTimes.forEach((media, idx) => {
        if (timesAtuais[idx].length > 0) {
            if (media > maiorMedia) { maiorMedia = media; idxMaiorMedia = idx; }
            if (media < menorMedia) { menorMedia = media; idxMenorMedia = idx; }
        }
      });

      if (idxMaiorMedia === -1 || idxMenorMedia === -1 || idxMaiorMedia === idxMenorMedia || timesAtuais[idxMaiorMedia].length === 0 || timesAtuais[idxMenorMedia].length === 0) break;

      let trocou = false;
      for (let i = 0; i < timesAtuais[idxMaiorMedia].length; i++) {
        for (let j = 0; j < timesAtuais[idxMenorMedia].length; j++) {
          const jogadorDoTimeRico = timesAtuais[idxMaiorMedia][i];
          const jogadorDoTimePobre = timesAtuais[idxMenorMedia][j];

          const novoTimeRico = [...timesAtuais[idxMaiorMedia]]; novoTimeRico[i] = jogadorDoTimePobre;
          const novoTimePobre = [...timesAtuais[idxMenorMedia]]; novoTimePobre[j] = jogadorDoTimeRico;

          if (isTimeValid(novoTimeRico) && isTimeValid(novoTimePobre)) {
            const novaMediaRico = calcularMediaTime(novoTimeRico);
            const novaMediaPobre = calcularMediaTime(novoTimePobre);
            
            const mediasAposTroca = [...mediasTimes];
            mediasAposTroca[idxMaiorMedia] = novaMediaRico;
            mediasAposTroca[idxMenorMedia] = novaMediaPobre;
            const maxMediaNova = Math.max(...mediasAposTroca.filter((m,ix)=>timesAtuais[ix].length > 0));
            const minMediaNova = Math.min(...mediasAposTroca.filter((m,ix)=>timesAtuais[ix].length > 0));
            const diffGlobalNova = maxMediaNova - minMediaNova;
            const diffGlobalOriginal = maiorMedia - menorMedia;

            if (diffGlobalNova < diffGlobalOriginal - 0.001) { 
              timesAtuais[idxMaiorMedia] = novoTimeRico;
              timesAtuais[idxMenorMedia] = novoTimePobre;
              trocou = true; break;
            }
          }
        }
        if (trocou) break;
      }
      if (!trocou) break; 
    }

    const todosOsTimesFormadosSaoValidos = timesAtuais.every(isTimeValid);
    if (!todosOsTimesFormadosSaoValidos) {
        tentativas++;
        continue; 
    }

    const mediasFinais = timesAtuais.map(t => calcularMediaTime(t)).filter((m,ix)=>timesAtuais[ix].length > 0);
    if (mediasFinais.length === 0 && n_jogadores > 0) { tentativas++; continue; }
    if (mediasFinais.length <= 1 && n_jogadores > 0) { 
        menorDiferencaMedias = 0;
        melhorCombinacaoDeTimes = timesAtuais.map(time => [...time]);
        break;
    }
    const maxMediaFinal = Math.max(...mediasFinais);
    const minMediaFinal = Math.min(...mediasFinais);
    const diffAtual = maxMediaFinal - minMediaFinal;

    if (diffAtual < menorDiferencaMedias) {
      menorDiferencaMedias = diffAtual;
      melhorCombinacaoDeTimes = timesAtuais.map(time => [...time]);
    }
    if (menorDiferencaMedias < (n_jogadores > 15 ? 0.2 : 0.5) && n_jogadores > 0) break; 
    tentativas++;
  }

  if (melhorCombinacaoDeTimes.length === 0 && n_jogadores > 0) {
    const jogadoresFallback = shuffleArray([...jogadoresSelecionadosParaSorteio]);
    melhorCombinacaoDeTimes = Array.from({ length: numeroDeTimesFinal }, () => []);
    let currentFallbackPlayerIndex = 0;
    for (let i = 0; i < numeroDeTimesFinal; i++) {
        const teamSize = tamanhos_dos_times_calculado[i];
        for (let j = 0; j < teamSize; j++) {
            if (currentFallbackPlayerIndex < jogadoresFallback.length) {
                melhorCombinacaoDeTimes[i].push(jogadoresFallback[currentFallbackPlayerIndex++]);
            }
        }
    }
  }

  return melhorCombinacaoDeTimes.filter(t => t.length > 0).map((timeJogadores, index) => ({
    id: CORES_TIMES_CONFIG[index % CORES_TIMES_CONFIG.length].id,
    nome: CORES_TIMES_CONFIG[index % CORES_TIMES_CONFIG.length].nome,
    cor: CORES_TIMES_CONFIG[index % CORES_TIMES_CONFIG.length].corHex,
    jogadores: timeJogadores.sort((a,b) => b.nota - a.nota),
    media: calcularMediaTime(timeJogadores),
  }));
}

export default function HomePage() {
  const [listaCompletaJogadores, setListaCompletaJogadores] = useState<Jogador[]>(todosJogadoresIniciais);
  const [jogadoresSelecionadosIds, setJogadoresSelecionadosIds] = useState<Set<number>>(new Set());
  const [timesSorteados, setTimesSorteados] = useState<Time[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCodeInput, setAdminCodeInput] = useState("");
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [cooldownRestante, setCooldownRestante] = useState(0);
  const [ultimoSorteioTimestamp, setUltimoSorteioTimestamp] = useState<number | null>(null);
  const [anoAtual, setAnoAtual] = useState<number>(new Date().getFullYear());
  
  const [timeEditando, setTimeEditando] = useState<Time | null>(null);
  const [jogadoresGlobaisParaEdicao, setJogadoresGlobaisParaEdicao] = useState<JogadorGlobal[]>([]);
  const [nomeEditando, setNomeEditando] = useState('');
  const [notaEditando, setNotaEditando] = useState<number | string>('');

  useEffect(() => {
    setAnoAtual(new Date().getFullYear());
    // Garante que o modo admin sempre comece desativado e limpa o localStorage
    localStorage.removeItem("isAdminPeloChurrasco"); 
    setIsAdmin(false);

    const ultimoSorteio = localStorage.getItem("ultimoSorteioTimestampPeloChurrasco");
    if (ultimoSorteio) {
      const ts = parseInt(ultimoSorteio, 10);
      setUltimoSorteioTimestamp(ts);
      const agora = Date.now();
      const diffSegundos = Math.floor((agora - ts) / 1000);
      const restante = COOLDOWN_SECONDS - diffSegundos;
      // A verificação de isAdmin aqui é para o cooldown, não para definir o estado de admin
      if (restante > 0 && !isAdmin) setCooldownRestante(restante); 
      else setCooldownRestante(0);
    }
  // A dependência [isAdmin] foi removida para que este efeito só rode na montagem inicial
  // e não seja reativado quando isAdmin mudar, o que poderia causar loops ou comportamentos indesejados
  // com a lógica de cooldown e localStorage. A lógica de admin é tratada no handleAdminCodeSubmit.
  }, []); 

  useEffect(() => {
    // Este useEffect lida apenas com o cooldown e depende de isAdmin para pará-lo se o admin logar.
    if (isAdmin || !ultimoSorteioTimestamp || cooldownRestante <= 0) {
      if (cooldownRestante > 0 && !isAdmin) {} else { setCooldownRestante(0); }
      return;
    }
    const interval = setInterval(() => {
      setCooldownRestante(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isAdmin, ultimoSorteioTimestamp, cooldownRestante]);

  const atualizarJogadoresGlobaisParaEdicao = useCallback((currentTimes: Time[], selectedIds: Set<number>, currentListaJogadores: Jogador[]) => {
    const todosJogadores: JogadorGlobal[] = currentListaJogadores.map(j => {
      const originalmenteSelecionado = selectedIds.has(j.id);
      let status: JogadorGlobal['status'] = originalmenteSelecionado ? 'sem_time' : 'ausente';
      let timeId: string | undefined = undefined;

      for (const time of currentTimes) {
        if (time.jogadores.find(p => p.id === j.id)) {
          const configCor = CORES_TIMES_CONFIG.find(c => c.id === time.id);
          status = configCor ? configCor.statusJogador : 'sem_time'; 
          timeId = time.id;
          break;
        }
      }
      return { ...j, status, originalmenteSelecionado, timeId };
    });
    setJogadoresGlobaisParaEdicao(todosJogadores);
  }, []);

  const handleSelecaoJogador = (idJogador: number) => {
    setJogadoresSelecionadosIds(prevSelecionados => {
      const novosSelecionados = new Set(prevSelecionados);
      if (novosSelecionados.has(idJogador)) {
        novosSelecionados.delete(idJogador);
      } else {
        if (novosSelecionados.size < MAX_JOGADORES_SORTEIO) {
          novosSelecionados.add(idJogador);
        }
      }
      return novosSelecionados;
    });
  };

  const podeSortearAgora = 
    jogadoresSelecionadosIds.size >= MIN_JOGADORES_SORTEIO && 
    jogadoresSelecionadosIds.size <= MAX_JOGADORES_SORTEIO && 
    (isAdmin || cooldownRestante <= 0);

  const handleSortearTimes = () => {
    if (!podeSortearAgora) return;
    const jogadoresParaSorteio = listaCompletaJogadores.filter(j => jogadoresSelecionadosIds.has(j.id));
    const novosTimesSorteados = sortearTimesEquilibrados(jogadoresParaSorteio);
    setTimesSorteados(novosTimesSorteados);
    atualizarJogadoresGlobaisParaEdicao(novosTimesSorteados, jogadoresSelecionadosIds, listaCompletaJogadores);
    if (!isAdmin) {
      const agora = Date.now();
      setUltimoSorteioTimestamp(agora);
      localStorage.setItem("ultimoSorteioTimestampPeloChurrasco", agora.toString());
      setCooldownRestante(COOLDOWN_SECONDS);
    }
  };

  const handleAdminCodeSubmit = () => {
    if (adminCodeInput === ADMIN_CODE) {
      setIsAdmin(true); 
      localStorage.setItem("isAdminPeloChurrasco", "true");
      setShowAdminInput(false); 
      setAdminCodeInput(""); 
      setCooldownRestante(0);
    } else {
      alert("Código de administrador incorreto!");
      localStorage.removeItem("isAdminPeloChurrasco");
      setIsAdmin(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handleVoltarParaSelecao = () => {
    setTimesSorteados([]);
    setJogadoresGlobaisParaEdicao([]);
    setTimeEditando(null); 
  };

  const iniciarEdicaoTime = (timeParaEditar: Time) => {
    setTimeEditando({...timeParaEditar}); 
  };

  const adicionarJogadorAoTimeEditando = (jogadorParaAdicionar: JogadorGlobal) => {
    if (!timeEditando || timeEditando.jogadores.length >= 5) return;

    const novosTimesSorteados = [...timesSorteados]; 
    const timeAlvoIndex = novosTimesSorteados.findIndex
(Content truncated due to size limit. Use line ranges to read in chunks)