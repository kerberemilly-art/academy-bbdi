export const ssdModule = {
    id: 6,
    title: 'SSD',
    icon: 'HardDrive',
    color: '#06b6d4',
    description: 'Trilha para orientar upgrade de SSD por tipo, encaixe, tamanho, velocidade e compatibilidade.',
    levels: [
      {
        id: 'basico',
        title: 'Básico',
        description: 'Função do SSD, diferença para HD e modelos SATA/mSATA/M.2/NVMe.',
        lesson: {
          steps: [
            {
              title: 'Função do SSD',
              content: 'Assim como o HD, o SSD armazena informações. A principal diferença é a velocidade.\n\nUm SSD pode ser até cinco vezes mais rápido que um HD convencional, melhorando abertura do sistema, programas e arquivos usados com frequência.\n\nÉ comum usar SSD junto com HD: o SSD para Windows e programas principais, e o HD para arquivos comuns.',
            },
            {
              title: 'SSD SATA III',
              content: 'SSD SATA III é compatível com a maioria dos computadores e muitas vezes substitui diretamente o HD.\n\nÉ uma opção comum de upgrade em notebooks antigos e pode atingir cerca de 500MB/s.\n\nQuando o cliente não especifica outro padrão e o notebook aceita SATA, é uma indicação segura para venda.',
            },
            {
              title: 'mSATA, M.2 e NVMe',
              content: 'mSATA é uma versão compacta derivada do Micro SATA, usada em notebooks. Tem velocidade parecida com SATA III, mas há tamanhos diferentes e não será trabalhada no momento.\n\nSSD M.2 é evolução do mSATA, mais veloz e visualmente identificado por duas ranhuras em muitos modelos.\n\nSSD M.2 NVMe é mais moderno, com maior velocidade de leitura e gravação, e normalmente possui apenas uma chave lateral.',
            },
          ],
          quiz: {
            title: 'Quiz: SSD - Nível Básico',
            questions: [
              {
                id: 'ssd-basico-q1',
                question: 'Qual é a principal vantagem do SSD em relação ao HD?',
                options: [
                  'Maior velocidade',
                  'Carregar a bateria',
                  'Trocar o layout do teclado',
                  'Aumentar a voltagem da fonte'
                ],
                correctAnswer: 0,
                explanation: 'O SSD é usado principalmente por oferecer leitura e gravação mais rápidas que HD.'
              },
              {
                id: 'ssd-basico-q2',
                question: 'Qual SSD costuma substituir diretamente um HD em muitos notebooks?',
                options: [
                  'SSD SATA III',
                  'Tela LED Slim',
                  'Memória DDR3L',
                  'Fonte Magsafe'
                ],
                correctAnswer: 0,
                explanation: 'SSD SATA III usa formato e interface comuns para troca de HD em muitos equipamentos.'
              },
              {
                id: 'ssd-basico-q3',
                question: 'Qual modelo é citado como mais moderno e mais rápido que o M.2 convencional?',
                options: [
                  'M.2 NVMe',
                  'mSATA antigo',
                  'HD convencional',
                  'Caddy 95mm'
                ],
                correctAnswer: 0,
                explanation: 'NVMe entrega maior velocidade de leitura e gravação.'
              },
              {
                id: 'ssd-basico-q4',
                question: 'Qual uso híbrido é comum em notebooks?',
                options: [
                  'SSD para sistema e programas; HD para arquivos comuns',
                  'Fonte para arquivos; teclado para Windows',
                  'Tela para armazenar dados; bateria para programas',
                  'RAM para guardar fotos permanentemente'
                ],
                correctAnswer: 0,
                explanation: 'O SSD acelera o sistema enquanto o HD pode manter armazenamento de maior volume.'
              },
              {
                id: 'ssd-basico-q5',
                question: 'Qual velocidade aproximada é citada para HD convencional?',
                options: [
                  '100MB/s',
                  '500MB/s',
                  '1400MB/s',
                  '3000MB/s'
                ],
                correctAnswer: 0,
                explanation: 'O HD convencional é citado em torno de 100MB/s, bem abaixo dos SSDs.'
              },
              {
                id: 'ssd-basico-q6',
                question: 'Qual modelo de SSD é derivado do Micro SATA?',
                options: [
                  'mSATA',
                  'Magsafe',
                  'DDR4',
                  'CCFL'
                ],
                correctAnswer: 0,
                explanation: 'mSATA vem de Micro SATA e foi usado em notebooks compactos.'
              },
              {
                id: 'ssd-basico-q7',
                question: 'Qual característica visual costuma aparecer no M.2 NVMe segundo o material?',
                options: [
                  'Apenas uma chave lateral',
                  'Cabo extra de backlight',
                  'Pino 7,4mm x 5,0mm',
                  'Enter em L'
                ],
                correctAnswer: 0,
                explanation: 'O material descreve o NVMe com uma chave do lado direito como pista visual.'
              },
              {
                id: 'ssd-basico-q8',
                question: 'Por que o SSD melhora a experiência do usuário?',
                options: [
                  'Porque acelera abertura do sistema e programas',
                  'Porque aumenta a voltagem do notebook',
                  'Porque substitui a fonte',
                  'Porque altera a resolução da tela'
                ],
                correctAnswer: 0,
                explanation: 'O ganho de velocidade aparece principalmente no carregamento do sistema e de programas.'
              }
            ]
          }
        }
      },
      {
        id: 'intermediario',
        title: 'Intermediário',
        description: 'Diferenças visuais, tamanhos M.2, soquetes e compatibilidade por modelo.',
        lesson: {
          steps: [
            {
              title: 'Diferenças visuais',
              content: 'O material mostra diferenças visuais entre SATA III, mSATA, M.2 e M.2 NVMe.\n\nSATA III tem formato maior, similar ao HD de notebook.\n\nM.2 convencional pode ter duas chaves/ranhuras.\n\nM.2 NVMe geralmente tem uma chave do lado direito.\n\nEssas pistas ajudam, mas não substituem a consulta de compatibilidade.',
            },
            {
              title: 'Tamanhos M.2',
              content: 'Os modelos M.2 podem aparecer como 2230, 2242, 2260 e 2280.\n\nOs dois primeiros números indicam a largura, normalmente 22mm.\n\nOs dois últimos números indicam o comprimento. Exemplo: M.2 2280 tem 22mm de largura e 80mm de comprimento.\n\nO tamanho físico precisa caber no notebook.',
            },
            {
              title: 'Compatibilidade por modelo',
              content: 'Para SSD M.2 e NVMe, confirme o modelo do notebook e pesquise se ele aceita o padrão desejado.\n\nNão indique NVMe sem certeza: ele não serve na entrada M.2 convencional quando o equipamento não suporta NVMe.\n\nClientes que pedem NVMe normalmente têm maior familiaridade técnica, mas a compatibilidade ainda precisa ser validada.',
            },
          ],
          quiz: {
            title: 'Quiz: SSD - Nível Intermediário',
            questions: [
              {
                id: 'ssd-intermediario-q1',
                question: 'No padrão M.2 2280, o que significa 80?',
                options: [
                  'Comprimento de 80mm',
                  'Velocidade de 80MB/s',
                  'Potência de 80W',
                  '80 pinos de tela'
                ],
                correctAnswer: 0,
                explanation: 'Em 2280, 22 é a largura e 80 é o comprimento em milímetros.'
              },
              {
                id: 'ssd-intermediario-q2',
                question: 'Qual cuidado é necessário antes de indicar SSD M.2 NVMe?',
                options: [
                  'Confirmar se o notebook suporta NVMe',
                  'Verificar se a fonte é tripolar',
                  'Trocar a tela por Full HD',
                  'Confirmar layout do teclado'
                ],
                correctAnswer: 0,
                explanation: 'NVMe não deve ser indicado sem validação de suporte no notebook.'
              },
              {
                id: 'ssd-intermediario-q3',
                question: 'O que os dois primeiros números de um M.2 2242 indicam?',
                options: [
                  'Largura de 22mm',
                  'Capacidade de 22GB',
                  'Velocidade de 22MB/s',
                  'Voltagem de 22V'
                ],
                correctAnswer: 0,
                explanation: 'O padrão M.2 usa os dois primeiros dígitos para largura e os dois finais para comprimento.'
              },
              {
                id: 'ssd-intermediario-q4',
                question: 'Qual afirmação é correta sobre pistas visuais de SSD?',
                options: [
                  'Ajudam na identificação, mas não substituem a consulta de compatibilidade',
                  'Garantem compatibilidade total',
                  'Servem apenas para telas',
                  'Não têm utilidade alguma'
                ],
                correctAnswer: 0,
                explanation: 'Formato visual ajuda, mas o notebook precisa aceitar interface e tamanho.'
              },
              {
                id: 'ssd-intermediario-q5',
                question: 'Qual tamanho M.2 indica 22mm de largura por 42mm de comprimento?',
                options: [
                  '2242',
                  '2280',
                  '2260',
                  '2230'
                ],
                correctAnswer: 0,
                explanation: 'No padrão M.2, os dois primeiros números são largura e os dois últimos são comprimento.'
              },
              {
                id: 'ssd-intermediario-q6',
                question: 'Por que o tamanho físico do M.2 precisa ser validado?',
                options: [
                  'Porque o SSD precisa caber no espaço e fixação do notebook',
                  'Porque define o layout do teclado',
                  'Porque altera o Part Number da tela',
                  'Porque muda o cabo da fonte'
                ],
                correctAnswer: 0,
                explanation: 'Mesmo com interface compatível, o comprimento precisa caber no notebook.'
              },
              {
                id: 'ssd-intermediario-q7',
                question: 'Qual frase descreve corretamente o M.2 convencional no material?',
                options: [
                  'É evolução do mSATA e pode ter duas ranhuras',
                  'É sempre igual ao HD de 2,5 polegadas',
                  'É um tipo de tela touch',
                  'É incompatível com qualquer notebook'
                ],
                correctAnswer: 0,
                explanation: 'O material trata o M.2 como evolução do mSATA e destaca as ranhuras como pista visual.'
              },
              {
                id: 'ssd-intermediario-q8',
                question: 'Qual situação pede cuidado especial com cliente que solicita NVMe?',
                options: [
                  'Confirmar se a entrada M.2 do notebook realmente suporta NVMe',
                  'Trocar automaticamente por SATA III',
                  'Vender apenas pela velocidade prometida',
                  'Ignorar o modelo do notebook'
                ],
                correctAnswer: 0,
                explanation: 'Nem toda entrada M.2 aceita NVMe; a compatibilidade precisa ser validada.'
              }
            ]
          }
        }
      },
      {
        id: 'avancado',
        title: 'Avançado',
        description: 'Caddy, velocidades, decisão de venda e cenários de upgrade.',
        lesson: {
          steps: [
            {
              title: 'Caddy para SSD',
              content: 'Caddy é um adaptador usado para remover o leitor de CD/DVD de notebooks antigos e instalar um SSD ou HD no lugar.\n\nÉ mais comum em notebooks antigos que ainda têm entrada para CD.\n\nExistem dois tamanhos principais citados: 9,5mm e 12,7mm. A diferença está na altura/grossura do notebook.',
            },
            {
              title: 'Velocidades comparativas',
              content: 'Referências de velocidade citadas:\n\nHD convencional: cerca de 100MB/s.\n\nSSD SATA III: cerca de 500MB/s.\n\nSSD M.2: cerca de 1400MB/s.\n\nSSD M.2 NVMe: cerca de 3000MB/s.\n\nEsses números ajudam a explicar o ganho de desempenho para o cliente.',
            },
            {
              title: 'Decisão de venda',
              content: 'Se o cliente não especificar o padrão e o notebook aceitar, SSD SATA III é a opção mais universal.\n\nSSD M.2 é superior ao SATA III, mas exige confirmar se o notebook aceita esse padrão.\n\nSSD M.2 NVMe é voltado a alto desempenho. Não indique sem certeza, porque não serve em toda entrada M.2.',
            },
            {
              title: 'Consulta de compatibilidade',
              content: 'Ao saber o modelo do notebook, consulte a compatibilidade de SSD.\n\nSe a base indicada não retornar resultado, pesquise diretamente pelo modelo do notebook.\n\nConfirme tipo de interface, tamanho físico e se há espaço/slot disponível antes da oferta.',
            },
          ],
          quiz: {
            title: 'Quiz: SSD - Nível Avançado',
            questions: [
              {
                id: 'ssd-avancado-q1',
                question: 'Para que serve um caddy?',
                options: [
                  'Substituir o leitor de CD/DVD por um espaço para SSD ou HD',
                  'Converter fonte 15V em 20V',
                  'Aumentar a resolução da tela',
                  'Mudar layout de teclado'
                ],
                correctAnswer: 0,
                explanation: 'O caddy permite reaproveitar o espaço do drive óptico para armazenamento.'
              },
              {
                id: 'ssd-avancado-q2',
                question: 'Quais alturas de caddy são citadas?',
                options: [
                  '9,5mm e 12,7mm',
                  '30 e 40 pinos',
                  '14 e 15,6 polegadas',
                  '65W e 90W'
                ],
                correctAnswer: 0,
                explanation: 'A altura do caddy precisa acompanhar a grossura do notebook.'
              },
              {
                id: 'ssd-avancado-q3',
                question: 'Qual velocidade aproximada é citada para SSD M.2 NVMe?',
                options: [
                  '3000MB/s',
                  '100MB/s',
                  '500MB/s',
                  '65MB/s'
                ],
                correctAnswer: 0,
                explanation: 'O material cita NVMe como a opção mais rápida, por volta de 3000MB/s.'
              },
              {
                id: 'ssd-avancado-q4',
                question: 'Se o cliente não especifica nada e o notebook aceita o padrão, qual SSD é a indicação mais universal?',
                options: [
                  'SSD SATA III',
                  'M.2 NVMe sem validar',
                  'mSATA de qualquer tamanho',
                  'Caddy sem SSD'
                ],
                correctAnswer: 0,
                explanation: 'SATA III é indicado como opção mais universal quando não há especificação diferente.'
              },
              {
                id: 'ssd-avancado-q5',
                question: 'Qual checklist deve ser feito antes de vender SSD avançado?',
                options: [
                  'Interface, tamanho físico e suporte do notebook',
                  'Layout BR ou US',
                  'Pino Magsafe 1 ou 2',
                  'Backlight CCFL ou LED'
                ],
                correctAnswer: 0,
                explanation: 'Compatibilidade de SSD depende de interface, espaço físico e suporte da placa.'
              },
              {
                id: 'ssd-avancado-q6',
                question: 'Qual velocidade aproximada é citada para SSD SATA III?',
                options: [
                  '500MB/s',
                  '100MB/s',
                  '1400MB/s',
                  '3000MB/s'
                ],
                correctAnswer: 0,
                explanation: 'O SATA III é citado por volta de 500MB/s, cerca de cinco vezes mais rápido que HD convencional.'
              },
              {
                id: 'ssd-avancado-q7',
                question: 'Qual velocidade aproximada é citada para SSD M.2 convencional?',
                options: [
                  '1400MB/s',
                  '100MB/s',
                  '500MB/s',
                  '65MB/s'
                ],
                correctAnswer: 0,
                explanation: 'O material posiciona o M.2 convencional em torno de 1400MB/s.'
              },
              {
                id: 'ssd-avancado-q8',
                question: 'Quando o caddy costuma ser mais útil?',
                options: [
                  'Em notebooks antigos com leitor de CD/DVD',
                  'Em notebooks sem qualquer baia interna',
                  'Para converter tela HD em Full HD',
                  'Para trocar layout BR por US'
                ],
                correctAnswer: 0,
                explanation: 'O caddy aproveita o espaço do leitor óptico, comum em notebooks antigos.'
              }
            ]
          }
        }
      }
    ]
  };

