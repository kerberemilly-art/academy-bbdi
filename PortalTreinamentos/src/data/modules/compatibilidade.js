export const compatibilidadeModule = {
  id: 8,
  title: 'Compatibilidade',
  icon: 'Zap',
  color: '#f97316',
  description: 'Guia mestre para identificação e compatibilidade de peças de notebook.',
  levels: [
    {
      id: 'guia-compatibilidade',
      title: 'Guia de Compatibilidade',
      description: 'Aprenda a identificar a identidade das peças e evitar erros comuns.',
      lesson: {
        steps: [
          {
            title: 'A Identidade da Peça (Part Number)',
            content: 'Imagine que cada peça tem um RG. Esse RG é o PART NUMBER (PN).\n\nONDE ENCONTRAR: Quase sempre em uma etiqueta branca ou prateada colada na própria peça.\n\nCOMO ELE É: Geralmente é uma mistura de letras e números. (Exemplo: NT156WHM-N42 ou M5Y1K).\n\nA REGRA: Se você achar o PN, 90% do seu trabalho está feito.',
          },
          {
            title: 'Fluxo de Decisão',
            content: '1. Cliente quer uma peça? -> PEÇA FOTO DA ETIQUETA DA PEÇA ANTIGA.\n\n2. Ele mandou a foto?\n   -> SE SIM: Procure pelo código da foto no sistema.\n   -> SE NÃO: Explique que modelos de notebook mudam as peças internamente. Peça para ele trazer o aparelho para abrir.\n\nDICA DE OURO: Nunca confie apenas no que o cliente fala. Peça sempre a foto do adesivo colado na peça original.',
          },
          {
            title: 'Identificação: Telas',
            content: 'As telas parecem iguais, mas estes detalhes são fatais:\n\nCONECTOR: Barra dourada com vários "dentinhos".\n- 30 PINOS: Barra CURTA (~2cm).\n- 40 PINOS: Barra LONGA (~3cm).\nATENÇÃO: Nunca tente encaixar o cabo errado!\n\nABAS (Orelhas): Buraquinhos para parafusar.\n- SLIM COM ABA: Tem as orelhinhas de metal.\n- SLIM SEM ABA: É lisa nas bordas (geralmente vai colada).\n\nFOSCA vs BRILHANTE: Pergunte se a tela reflete como um espelho (Brilhante) ou se é opaca (Fosca).',
          },
          {
            title: 'Identificação: Fontes',
            content: 'O segredo não é a caixa preta, é a PONTA (o plugue):\n\nPINO COM AGULHA: Olhe dentro do buraco. Se houver um "espeto" ou agulha lá no fundo, é um modelo específico (comum em Dell e HP).\n\nPINO OCO: Parece um canudinho. Meça a largura (5.5mm é o mais comum).\n\nVOLTAGEM (V) vs AMPERAGEM (A):\n- VOLTAGEM (V): Deve ser IGUAL.\n- AMPERAGEM (A): Pode ser IGUAL OU MAIOR. Nunca menor.',
          },
          {
            title: 'Identificação: Baterias e Teclados',
            content: 'BATERIAS:\n- EXTERNA: Travas externas.\n- INTERNA: Exige abertura do notebook.\n- IDENTIFICAÇÃO: Procure por TYPE, MODEL ou REPLACE (Ex: TYPE M5Y1K).\n\nTECLADOS:\nO ENTER:\n- FORMATO "L" (Bota): Padrão Brasileiro (ABNT2). Tem a tecla "Ç".\n- FORMATO RETO: Padrão Americano (US). NÃO tem "Ç".\n\nO FRAME (Grade):\n- SEM FRAME: Você vê o plástico da carcaça entre as teclas.\n- COM FRAME: Já vem com uma gradezinha em volta de cada tecla.',
          },
          {
            title: 'Memória e SSD',
            content: 'SSD:\n- 2.5 polegadas: Quadradinho.\n- M.2 (Chiclete):\n  - NVMe: UM CORTE no conector. Mais rápido.\n  - SATA: DOIS CORTES no conector. Antigo.\n\nMEMÓRIA RAM:\n- DDR3 vs DDR4: O "cortinho" na parte dourada está em lugares diferentes.\n- DDR3L: O "L" é de Low (Baixa voltagem). Na dúvida, venda DDR3L, pois funciona em quase tudo.',
          },
        ],
        quiz: {
          title: 'Teste de Compatibilidade (40 Questões)',
          questions: [
            {
              id: 'compat-q1',
              question: 'Qual referência atende tanto o Dell Alienware m15 R7 AMD quanto o Dell Alienware m15 Ryzen Edition R5?',
              options: [
                'BB11-DE5550',
                'BB11-DE157',
                'BB11-DE125',
                'BB11-DE087'
              ],
              correctAnswer: 0,
              explanation: 'As duas versões do Alienware m15 usam a mesma referência compatível, BB11-DE5550.'
            },
            {
              id: 'compat-q2',
              question: 'Qual bateria é indicada para o Dell Alienware P43F?',
              options: [
                'BB11-DE103',
                'BB11-DE140',
                'BB11-DE157',
                'BB11-DE122'
              ],
              correctAnswer: 2,
              explanation: 'Na planilha, o Dell Alienware P43F aparece vinculado à referência BB11-DE157.'
            },
            {
              id: 'compat-q3',
              question: 'Qual referência corresponde ao Dell Alienware M11X?',
              options: [
                'BB11-DE103',
                'BB11-DE135',
                'BB11-DEAR1',
                'BB11-DE126'
              ],
              correctAnswer: 0,
              explanation: 'O M11X usa a referência BB11-DE103, conforme a compatibilidade da planilha.'
            },
            {
              id: 'compat-q4',
              question: 'Qual bateria atende o Dell Inspiron 13 (5368)?',
              options: [
                'BB11-DE125',
                'BB11-DE120',
                'BB11-DE142',
                'BB11-DE067'
              ],
              correctAnswer: 0,
              explanation: 'O Inspiron 13 (5368) está associado à referência BB11-DE125.'
            },
            {
              id: 'compat-q5',
              question: 'Qual fonte atende o Acer Aspire One D255 com potência de 40W?',
              options: [
                'BB20-AC19-B21',
                'BB20-AC19-ONE40',
                'BB20-AC19-E25',
                'BB20-DE19-B'
              ],
              correctAnswer: 1,
              explanation: 'O Aspire One D255 usa a referência BB20-AC19-ONE40 e trabalha com 40W.'
            },
            {
              id: 'compat-q6',
              question: 'Qual combinação da planilha corresponde ao Acer Aspire VN7-791?',
              options: [
                'BB20-AC19-E25 / 135W',
                'BB20-AC19-B21 / 65W',
                'BB20-AC19-ONE40 / 40W',
                'BB20-DE19-A / 65W'
              ],
              correctAnswer: 0,
              explanation: 'A planilha vincula o VN7-791 à referência BB20-AC19-E25 com potência de 135W.'
            },
            {
              id: 'compat-q7',
              question: 'Qual fonte é indicada para o HP 240 G2?',
              options: [
                'BB20-HP19-4 / 65W',
                'BB20-HP19-40 / 40W',
                'BB20-CP18-A / 65W',
                'BB20-SO19-B2 / 92W'
              ],
              correctAnswer: 0,
              explanation: 'Na planilha, o HP 240 G2 está associado à referência BB20-HP19-4 e potência de 65W.'
            },
            {
              id: 'compat-q8',
              question: 'Qual opção corresponde ao Sony PCG-61A11X?',
              options: [
                'BB20-SO19-B2 / 92W',
                'BB20-SO16 / 65W',
                'BB20-HP19-4 / 65W',
                'BB20-DE19-A / 65W'
              ],
              correctAnswer: 0,
              explanation: 'O PCG-61A11X usa a referência BB20-SO19-B2 com potência de 92W.'
            },
            {
              id: 'compat-q9',
              question: 'Qual modelo de tela corresponde a 14.0 1366x768 LED 40P SLIM P/ DELL?',
              options: [
                'B140XW03-V.0',
                'B140XTT01.0',
                'NT140WHM-N44',
                'LP140WF1-SPU1'
              ],
              correctAnswer: 0,
              explanation: 'A descrição da planilha vincula essa tela ao modelo B140XW03-V.0.'
            },
            {
              id: 'compat-q10',
              question: 'Qual tela da lista é 14.0 1920x1080 30P NARROW C/SUPORTE?',
              options: [
                'LP140WF1-SPU1',
                'NT140WHM-N44',
                'N140HCE-EN1',
                'B140XTT01.0'
              ],
              correctAnswer: 2,
              explanation: 'Na planilha, o modelo N140HCE-EN1 corresponde a essa descrição.'
            },
            {
              id: 'compat-q11',
              question: 'Qual peça da lista é uma tela 14.0 1366x768 40P TOUCH C/ABAS?',
              options: [
                'B140XTT01.0',
                'N140HCE-EN1',
                'LP140WF1-SPU1',
                'B116AW02-V.0'
              ],
              correctAnswer: 0,
              explanation: 'O código B140XTT01.0 é o modelo touch com abas dessa linha.'
            },
            {
              id: 'compat-q12',
              question: 'Qual modelo representa 11.6 1024x600 LED RIGHT UNIV.?',
              options: [
                'B116AW02-V.0',
                'CLAA070NA01CW',
                'LP140WF1-SPU1',
                'NT140WHM-N44'
              ],
              correctAnswer: 0,
              explanation: 'A descrição 11.6 1024x600 LED RIGHT UNIV. corresponde a B116AW02-V.0.'
            },
            {
              id: 'compat-q13',
              question: 'Qual bateria corresponde ao Acer AS10D?',
              options: [
                'BB11-AC066',
                'BB11-AC371',
                'BB11-LE043',
                'BB11-DE120'
              ],
              correctAnswer: 0,
              explanation: 'A planilha vincula o Acer AS10D à referência BB11-AC066.'
            },
            {
              id: 'compat-q14',
              question: 'Qual bateria corresponde ao Lenovo FRU 42T4536?',
              options: [
                'BB11-LE043',
                'BB11-HP032',
                'BB11-LE007-A',
                'BB11-DE102'
              ],
              correctAnswer: 2,
              explanation: 'A referência correta para o Lenovo FRU 42T4536 é BB11-LE007-A.'
            },
            {
              id: 'compat-q15',
              question: 'Qual bateria atende o Lenovo IdeaPad 320-14ABR?',
              options: [
                'BB11-DE087',
                'BB11-LE043',
                'BB11-LE007-A',
                'BB11-AC371'
              ],
              correctAnswer: 1,
              explanation: 'Na planilha, o IdeaPad 320-14ABR está associado à referência BB11-LE043.'
            },
            {
              id: 'compat-q16',
              question: 'Qual referência atende o HP 2133 MINI-NOTE PC KR922UT?',
              options: [
                'BB11-HP109',
                'BB11-HP032-A',
                'BB11-HP088',
                'BB11-HP032'
              ],
              correctAnswer: 3,
              explanation: 'A planilha aponta o HP 2133 MINI-NOTE PC KR922UT para BB11-HP032.'
            },
            {
              id: 'compat-q17',
              question: 'Qual bateria é usada no Dell Inspiron 14 5000 Series (5458)?',
              options: [
                'BB11-DE120',
                'BB11-DE102',
                'BB11-DE3410',
                'BB11-DE5550'
              ],
              correctAnswer: 0,
              explanation: 'O Dell Inspiron 14 5000 Series (5458) aparece com a referência BB11-DE120.'
            },
            {
              id: 'compat-q18',
              question: 'Qual bateria atende o Dell Inspiron 14z-5423 Ultrabook?',
              options: [
                'BB11-DE087',
                'BB11-DE120',
                'BB11-DE102',
                'BB11-DE125'
              ],
              correctAnswer: 2,
              explanation: 'A referência correta da planilha para o Inspiron 14z-5423 Ultrabook é BB11-DE102.'
            },
            {
              id: 'compat-q19',
              question: 'Qual bateria corresponde ao Dell Inspiron 15 5501?',
              options: [
                'BB11-DE3410',
                'BB11-DE125',
                'BB11-DE142',
                'BB11-DE103'
              ],
              correctAnswer: 0,
              explanation: 'O Inspiron 15 5501 está vinculado à referência BB11-DE3410.'
            },
            {
              id: 'compat-q20',
              question: 'Qual bateria corresponde ao Dell Inspiron 15 7510?',
              options: [
                'BB11-DE3410',
                'BB11-DE120',
                'BB11-DE125',
                'BB11-DE5550'
              ],
              correctAnswer: 3,
              explanation: 'A planilha indica BB11-DE5550 para o Dell Inspiron 15 7510.'
            },
            {
              id: 'compat-q21',
              question: 'Onde encontrar a "Identidade" (Part Number) de uma peça de notebook?',
              options: [
                'Em uma etiqueta branca ou prateada colada na própria peça',
                'Apenas no manual do usuário em PDF',
                'Na caixa de papelão da embalagem externa',
                'Apenas no site do fabricante do notebook'
              ],
              correctAnswer: 0,
              explanation: 'O Part Number fica colado na peça física para garantir a identificação correta.'
            },
            {
              id: 'compat-q22',
              question: 'Qual a diferença física no conector de uma tela de 30 pinos para uma de 40 pinos?',
              options: [
                'A barra dourada de 30 pinos é curta (~2cm) e a de 40 pinos é longa (~3cm)',
                'A de 30 pinos é azul e a de 40 pinos é verde',
                'A de 30 pinos fica em cima e a de 40 pinos embaixo',
                'Não há diferença física visível'
              ],
              correctAnswer: 0,
              explanation: 'O comprimento do conector (barra dourada) é o principal critério visual.'
            },
            {
              id: 'compat-q23',
              question: 'Sobre fontes, qual a regra para Voltagem (V) e Amperagem (A) ao substituir o carregador?',
              options: [
                'Voltagem deve ser igual; Amperagem pode ser igual ou maior',
                'Amperagem deve ser igual; Voltagem pode ser igual ou maior',
                'Ambas devem ser menores que a original',
                'Voltagem deve ser maior; Amperagem deve ser menor'
              ],
              correctAnswer: 0,
              explanation: 'A voltagem precisa ser precisa (margem de 1.5V), enquanto a amperagem indica a capacidade de entrega da fonte.'
            },
            {
              id: 'compat-q24',
              question: 'Como identificar um teclado padrão Brasileiro (ABNT2) no notebook?',
              options: [
                'Tecla Enter em formato de "L" (bota) e presença da tecla "Ç"',
                'Tecla Enter retinha e ausência da tecla "Ç"',
                'Teclas coloridas e numérico separado',
                'Apenas pela marca do notebook'
              ],
              correctAnswer: 0,
              explanation: 'O Enter em "L" e o "Ç" são as marcas registradas do padrão ABNT2.'
            },
            {
              id: 'compat-q25',
              question: 'Qual a diferença visual entre SSD M.2 SATA e M.2 NVMe?',
              options: [
                'SATA tem dois cortes no conector; NVMe tem apenas um corte',
                'SATA é maior que o NVMe fisicamente',
                'NVMe é azul e SATA é preto',
                'SATA usa cabo e NVMe não usa'
              ],
              correctAnswer: 0,
              explanation: 'Os cortes (chaves B e M) definem visualmente o protocolo do SSD M.2.'
            },
            {
              id: 'compat-q26',
              question: 'O que o "L" significa em uma memória RAM DDR3L?',
              options: [
                'Low (Baixa voltagem)',
                'Large (Alta capacidade)',
                'Long (Mais comprida)',
                'Laptop (Exclusiva para notebooks)'
              ],
              correctAnswer: 0,
              explanation: 'DDR3L trabalha com 1.35V em vez dos 1.5V da DDR3 comum.'
            },
            {
              id: 'compat-q27',
              question: 'No fluxo de decisão, o que fazer se o cliente não enviar a foto da etiqueta da peça antiga?',
              options: [
                'Explicar que modelos mudam internamente e pedir para trazer o aparelho',
                'Vender o modelo mais comum por sorte',
                'Cancelar o atendimento imediatamente',
                'Vender pelo modelo do notebook sem garantir compatibilidade'
              ],
              correctAnswer: 0,
              explanation: 'A segurança do atendimento exige a validação visual para evitar erros de logística.'
            },
            {
              id: 'compat-q28',
              question: 'Como medir corretamente o plugue de uma fonte com "pino oco"?',
              options: [
                'Pela largura/diâmetro externo do canudinho (Ex: 5.5mm)',
                'Pelo comprimento total do cabo',
                'Pela cor do plástico interno',
                'Pela espessura do fio de energia'
              ],
              correctAnswer: 0,
              explanation: 'O diâmetro do pino (ex: 5.5mm, 4.0mm, 3.0mm) é o que define o encaixe no DC Power Jack.'
            },
            {
              id: 'compat-q29',
              question: 'Qual o risco de tentar encaixar um cabo de 40 pinos em uma tela de 30 pinos?',
              options: [
                'Estragar a tela e o notebook (curto-circuito)',
                'A tela apenas não vai ligar',
                'A imagem vai aparecer com cores erradas',
                'O teclado vai parar de funcionar'
              ],
              correctAnswer: 0,
              explanation: 'Forçar conexões elétricas incompatíveis causa danos irreversíveis aos componentes.'
            },
            {
              id: 'compat-q30',
              question: 'Se um teclado é "Com Frame", o que isso significa visualmente?',
              options: [
                'Ele já vem com a gradezinha de plástico em volta de cada tecla',
                'Ele não possui teclas numéricas',
                'Ele é transparente',
                'Ele possui luz interna (Backlight)'
              ],
              correctAnswer: 0,
              explanation: 'O frame é a moldura que fica entre as teclas. Alguns teclados são vendidos com ele, outros sem.'
            },
            {
              id: 'compat-q31',
              question: 'Um cliente tem um notebook com bateria interna. O que ele deve fazer para identificar o Part Number?',
              options: [
                'Abrir o equipamento para ver a etiqueta da bateria',
                'Olhar embaixo do notebook apenas',
                'Verificar a caixa da fonte',
                'Pesquisar apenas pelo nome da marca'
              ],
              correctAnswer: 0,
              explanation: 'Baterias internas exigem a abertura da carcaça para acesso à etiqueta de identificação.'
            },
            {
              id: 'compat-q32',
              question: 'Qual a principal diferença visual de uma fonte para Dell/HP que usa "Pino com Agulha"?',
              options: [
                'Existe um espeto metálico fino dentro do buraco do plugue',
                'O plugue é quadrado',
                'O plugue tem formato de USB',
                'O plugue possui 3 cortes laterais'
              ],
              correctAnswer: 0,
              explanation: 'A agulha central (pin central) é usada para comunicação de potência com o notebook.'
            },
            {
              id: 'compat-q33',
              question: 'O que define uma tela como "Slim com Aba"?',
              options: [
                'Possui orelhas metálicas com furos para parafusos nas bordas',
                'Ela é mais grossa que as telas comuns',
                'Ela não possui conector de 30 pinos',
                'Ela é curva'
              ],
              correctAnswer: 0,
              explanation: 'As abas (brackets) servem para fixar a tela na moldura do notebook.'
            },
            {
              id: 'compat-q34',
              question: 'Na identificação de fontes, o que significa a sigla "Output" na etiqueta?',
              options: [
                'A saída de energia que vai para o notebook',
                'A entrada de energia da tomada de parede',
                'A temperatura máxima da fonte',
                'O tempo de garantia do produto'
              ],
              correctAnswer: 0,
              explanation: 'O Output detalha V, A e W que o notebook receberá.'
            },
            {
              id: 'compat-q35',
              question: 'Por que a DDR3L é considerada a "venda mais segura" na dúvida?',
              options: [
                'Porque ela funciona tanto em slots DDR3 (1.5V) quanto DDR3L (1.35V)',
                'Porque ela é mais barata que a DDR2',
                'Porque ela cabe no slot de DDR4',
                'Porque ela nunca queima'
              ],
              correctAnswer: 0,
              explanation: 'A DDR3L é "dual voltage", sendo compatível com sistemas de baixa e alta voltagem da geração DDR3.'
            },
            {
              id: 'compat-q36',
              question: 'Um notebook que usa tela "Fosca" pode receber uma tela "Brilhante" com o mesmo Part Number?',
              options: [
                'Sim, o encaixe e a imagem serão compatíveis, mudando apenas o reflexo',
                'Não, queima o cabo flat',
                'Não, a resolução muda automaticamente',
                'Sim, mas o teclado deixará de funcionar'
              ],
              correctAnswer: 0,
              explanation: 'Fosca (Matte) e Brilhante (Glossy) são acabamentos de superfície. A compatibilidade técnica é a mesma.'
            },
            {
              id: 'compat-q37',
              question: 'O que o código "M5Y1K" representa em uma bateria Dell?',
              options: [
                'O Part Number (Tipo) da bateria',
                'A data de fabricação',
                'A capacidade total de carga',
                'O peso da peça'
              ],
              correctAnswer: 0,
              explanation: 'M5Y1K é um exemplo real de Part Number (Type) usado pela Dell.'
            },
            {
              id: 'compat-q38',
              question: 'Qual o formato físico do SSD M.2?',
              options: [
                'Parece um chiclete (fino e retangular)',
                'Parece um HD de desktop (grande e pesado)',
                'Parece um pendrive USB',
                'Parece um CD'
              ],
              correctAnswer: 0,
              explanation: 'O formato M.2 é compacto e em formato de lâmina, lembrando uma goma de mascar.'
            },
            {
              id: 'compat-q39',
              question: 'O que significa um teclado ser "Sem Frame"?',
              options: [
                'Ele deve ser instalado por baixo da carcaça do notebook',
                'Ele não possui a tecla Enter',
                'Ele é exclusivo para notebooks Apple',
                'Ele não possui cabo flat'
              ],
              correctAnswer: 0,
              explanation: 'Teclados sem frame são fixados na estrutura interna (topcase) do notebook.'
            },
            {
              id: 'compat-q40',
              question: 'Ao medir a barra dourada de uma tela, você encontra cerca de 3cm. Qual a pinagem?',
              options: [
                '40 pinos',
                '30 pinos',
                '20 pinos',
                '50 pinos'
              ],
              correctAnswer: 0,
              explanation: 'Conectores de 40 pinos são fisicamente mais largos que os de 30 pinos.'
            }
          ]
        }
      }
    }
  ]
};
