export const tecladosModule = {
    id: 4,
    title: 'Teclados',
    icon: 'Keyboard',
    color: '#f59e0b',
    description: 'Trilha para identificar teclados por encaixe, layout, frame, funções, backlight e variações de compatibilidade.',
    levels: [
      {
        id: 'basico',
        title: 'Básico',
        description: 'Part Number, cabo flat, encaixe, layout, teclado numérico e topcase.',
        lesson: {
          steps: [
            {
              title: 'Função e identificação inicial',
              content: 'O teclado é uma das peças de notebook que mais precisa de substituição, principalmente por defeitos ou acidentes.\n\nNa parte traseira, observe Part Number, cabo flat, parafusos, encaixe e, quando existir, backlight.\n\nO Part Number ajuda, mas não deve ser usado sozinho, porque layout e padrão do teclado nem sempre aparecem apenas pelo código.',
              image: '/images/teclado/teclado_básico_p4_i2.jpeg',
              imagePlacement: 'afterContent',
            },
            {
              title: 'Tipos de encaixe',
              content: 'Existem dois cenários principais de encaixe.\n\nEncaixe por cima: a peça completa do teclado é acoplada no local destinado na carcaça.\n\nTeclado por baixo: o teclado é encaixado de dentro para fora, muitas vezes preso à carcaça ou usado com frame antigo.\n\nO tipo de encaixe define se uma troca de layout ou variação física será viável.',
              image: '/images/teclado/teclado_básico_p7_i2.jpeg',
              imagePlacement: 'afterContent',
            },
            {
              title: 'Layout e teclado numérico',
              content: 'No Brasil, o padrão comum é ABNT2, com disposição QWERTY.\n\nOs layouts mais citados são BR, US e PO. Eles mudam idioma, posição e formato de algumas teclas.\n\nEm geral, notebooks de até 14 polegadas não usam teclado numérico lateral. Modelos de 15,6 e 17 polegadas costumam ter teclado numérico.',
              image: '/images/teclado/teclado_básico_p8_i3.jpeg',
              imagePlacement: 'afterContent',
            },
            {
              title: 'Topcase',
              content: 'Alguns teclados são vendidos junto com a carcaça superior do notebook. Essas peças completas são chamadas de topcase.\n\nQuando a peça já vem completa, a análise de encaixe de teclado isolado perde importância, porque o conjunto já inclui a carcaça correspondente.\n\nAinda assim, é necessário validar compatibilidade com o modelo do notebook.',
              image: '/images/teclado/teclado_básico_p5_i2.jpeg',
              imagePlacement: 'afterContent',
            },
          ],
          quiz: {
            title: 'Quiz: Teclados - Nível Básico',
            questions: [
              {
                id: 'teclados-basico-q1',
                question: 'Por que o Part Number do teclado não deve ser usado sozinho?',
                options: [
                  'Porque layout e padrão BR/US/PO podem não estar claros apenas pelo código',
                  'Porque teclado não tem Part Number',
                  'Porque Part Number só serve para fontes',
                  'Porque ele indica a resolução da tela'
                ],
                correctAnswer: 0,
                explanation: 'O material alerta que layout e padrão podem exigir comparação visual além do Part Number.'
              },
              {
                id: 'teclados-basico-q2',
                question: 'Qual padrão de teclado é comum no Brasil?',
                options: [
                  'ABNT2',
                  'Magsafe',
                  'NVMe',
                  'CCFL'
                ],
                correctAnswer: 0,
                explanation: 'O padrão brasileiro comum é ABNT2.'
              },
              {
                id: 'teclados-basico-q3',
                question: 'Em geral, quais notebooks costumam ter teclado numérico lateral?',
                options: [
                  'Modelos de 15,6 e 17 polegadas',
                  'Apenas modelos de 10,1 polegadas',
                  'Somente tablets',
                  'Qualquer modelo de 11 polegadas'
                ],
                correctAnswer: 0,
                explanation: 'O material indica teclado numérico principalmente em modelos maiores.'
              },
              {
                id: 'teclados-basico-q4',
                question: 'O que é topcase?',
                options: [
                  'Teclado vendido junto com a carcaça superior do notebook',
                  'Uma fonte de maior potência',
                  'Um tipo de tela narrow frame',
                  'Um adaptador de SSD'
                ],
                correctAnswer: 0,
                explanation: 'Topcase é a peça completa com teclado e carcaça superior.'
              },
              {
                id: 'teclados-basico-q5',
                question: 'Qual item passa dados e comandos do teclado para o notebook?',
                options: [
                  'Cabo flat',
                  'Pino da fonte',
                  'Backlight da tela',
                  'Caddy'
                ],
                correctAnswer: 0,
                explanation: 'O cabo flat é a conexão responsável por transmitir os dados do teclado ao notebook.'
              },
              {
                id: 'teclados-basico-q6',
                question: 'O que deve ser comparado quando há mais de uma opção de teclado no site?',
                options: [
                  'Layout, funções de tecla e características do teclado antigo',
                  'Apenas a cor do notebook',
                  'Somente a capacidade do SSD',
                  'A potência da bateria'
                ],
                correctAnswer: 0,
                explanation: 'O material usa referências como a tecla Wi-Fi e o teclado antigo para diferenciar opções semelhantes.'
              },
              {
                id: 'teclados-basico-q7',
                question: 'Qual é uma característica do encaixe por cima?',
                options: [
                  'A peça completa é acoplada no local destinado no notebook',
                  'A tela precisa ser removida para consultar o Part Number',
                  'A fonte precisa ter 90W',
                  'O SSD precisa ser NVMe'
                ],
                correctAnswer: 0,
                explanation: 'No encaixe por cima, o teclado entra como peça completa no espaço da carcaça.'
              },
              {
                id: 'teclados-basico-q8',
                question: 'Qual pergunta ajuda a evitar erro em notebooks maiores?',
                options: [
                  'O teclado antigo possui teclado numérico lateral?',
                  'A tela é CCFL?',
                  'A fonte é Magsafe?',
                  'O SSD tem 3000MB/s?'
                ],
                correctAnswer: 0,
                explanation: 'Modelos maiores podem ter teclado numérico; essa diferença muda a peça correta.'
              }
            ]
          }
        }
      },
      {
        id: 'intermediario',
        title: 'Intermediário',
        description: 'Identificação pelo modelo, layouts BR/US/PO, frame, teclas especiais e backlight.',
        lesson: {
          steps: [
            {
              title: 'Identificando pelo modelo do notebook',
              content: 'Assim como em baterias, uma boa forma de iniciar a identificação do teclado é pelo modelo do notebook.\n\nPodem ser usados sites de referência como CheapLaptopKeyboard e PowerBookMedic. No Brasil, BringIt e ELGScreen ajudam como referência de concorrentes.\n\nDepois da consulta, compare visualmente layout, encaixe, cabo flat e variações físicas.',
            },
            {
              title: 'Diferenças de layout',
              content: 'BR/ABNT: costuma ter Enter em L, tecla Ç e o ? na parte inferior, perto do Enter.\n\nUS/Americano: costuma ter Enter longo e não possui Ç.\n\nPO/Português Portugal: pode ter Enter em L, Ç e o ? em posição superior.\n\nO ideal é vender o mesmo layout antigo. Mudança de layout só deve ser feita com análise física e alinhamento com o cliente.',
              image: '/images/teclado/teclado_intermediario_p3_i2.jpeg',
              imagePlacement: 'afterContent',
            },
            {
              title: 'Frame e encaixe acoplado',
              content: 'Frame é a moldura que acompanha o teclado e dá acabamento, deixando menos espaço entre as teclas.\n\nQuando o teclado tem frame ou é acoplado à carcaça, a posição e o formato das teclas precisam bater com os espaços da carcaça.\n\nNesses casos, diferenças entre BR e US, como formato do Enter e Shift, podem inviabilizar a troca.',
              image: '/images/teclado/teclado_intermediario_p6_i4.jpeg',
              imagePlacement: 'afterContent',
            },
            {
              title: 'Teclas de função e backlight',
              content: 'Teclas superiores podem ter funções diferentes, como Wi-Fi, volume e brilho.\n\nO desenho na tecla não dita a função real. A função segue o que o notebook espera do teclado original.\n\nBacklight é a iluminação do teclado. Ele costuma ser identificado por um cabo fino laranja ou preto, paralelo ao cabo flat normal.',
              image: '/images/teclado/teclado_intermediario_p10_i2.jpeg',
              imagePlacement: 'afterContent',
            },
          ],
          quiz: {
            title: 'Quiz: Teclados - Nível Intermediário',
            questions: [
              {
                id: 'teclados-intermediario-q1',
                question: 'Qual é o melhor ponto de partida para identificar um teclado?',
                options: [
                  'Modelo do notebook, seguido de comparação física',
                  'Apenas a cor das teclas',
                  'Apenas a potência da fonte',
                  'A resolução da tela'
                ],
                correctAnswer: 0,
                explanation: 'O modelo orienta a busca, mas a comparação física evita erro de layout e encaixe.'
              },
              {
                id: 'teclados-intermediario-q2',
                question: 'Qual layout normalmente não possui a tecla Ç?',
                options: [
                  'US',
                  'BR',
                  'PO',
                  'ABNT2'
                ],
                correctAnswer: 0,
                explanation: 'O layout americano não possui Ç.'
              },
              {
                id: 'teclados-intermediario-q3',
                question: 'Quando diferenças entre BR e US podem inviabilizar a substituição?',
                options: [
                  'Quando o teclado usa frame ou encaixe acoplado à carcaça',
                  'Quando a fonte é bivolt',
                  'Quando a tela é HD',
                  'Quando o SSD é SATA'
                ],
                correctAnswer: 0,
                explanation: 'O formato físico das teclas precisa encaixar nos espaços da carcaça/frame.'
              },
              {
                id: 'teclados-intermediario-q4',
                question: 'O que ajuda a identificar um teclado com backlight?',
                options: [
                  'Cabo fino extra, laranja ou preto, paralelo ao cabo flat normal',
                  'Pino de fonte 7,4mm',
                  'Conector de tela 40 pinos',
                  'Memória DDR4'
                ],
                correctAnswer: 0,
                explanation: 'O backlight usa um cabo específico além do flat principal.'
              },
              {
                id: 'teclados-intermediario-q5',
                question: 'Se o teclado novo mostra Wi-Fi no F11, mas o antigo acionava Wi-Fi no F4, o que tende a acontecer?',
                options: [
                  'A função segue o comando esperado pelo teclado antigo/notebook',
                  'O notebook troca automaticamente de placa Wi-Fi',
                  'A bateria deixa de carregar',
                  'A tela muda para Full HD'
                ],
                correctAnswer: 0,
                explanation: 'O símbolo na tecla pode mudar, mas a função depende do mapeamento esperado pelo equipamento.'
              },
              {
                id: 'teclados-intermediario-q6',
                question: 'Qual diferença visual é típica do layout BR/ABNT em relação ao US?',
                options: [
                  'Presença da tecla Ç',
                  'Conector de fonte USB-C',
                  'Cabo flat de tela 40 pinos',
                  'SSD com duas ranhuras'
                ],
                correctAnswer: 0,
                explanation: 'A tecla Ç é um dos sinais mais relevantes para diferenciar layout brasileiro do americano.'
              },
              {
                id: 'teclados-intermediario-q7',
                question: 'Qual é a função do frame em um teclado?',
                options: [
                  'Dar acabamento e reduzir espaços entre as teclas',
                  'Aumentar a voltagem do teclado',
                  'Armazenar dados do sistema',
                  'Transformar teclado US em BR'
                ],
                correctAnswer: 0,
                explanation: 'O frame é a moldura de acabamento do teclado e interfere nos recortes físicos.'
              },
              {
                id: 'teclados-intermediario-q8',
                question: 'Quando o cliente quer trocar layout, qual deve ser a orientação?',
                options: [
                  'Comparar encaixe, frame e disposição das teclas antes de confirmar',
                  'Confirmar apenas se a marca do notebook é a mesma',
                  'Trocar sempre sem avisar',
                  'Ignorar Enter, Shift e Ç'
                ],
                correctAnswer: 0,
                explanation: 'Mudança de layout pode falhar por formato de teclas e recortes da carcaça.'
              }
            ]
          }
        }
      },
      {
        id: 'avancado',
        title: 'Avançado',
        description: 'Decisão de substituição, variações críticas, pointstick e orientação comercial.',
        lesson: {
          steps: [
            {
              title: 'Quando aceitar layout diferente',
              content: 'A troca por layout diferente só deve ser considerada quando o encaixe da peça inteira permite a substituição e quando o modelo não depende de frame ou recortes rígidos da carcaça.\n\nMesmo quando fisicamente compatível, explique ao cliente que símbolos e posição de teclas podem mudar.',
              image: '/images/teclado/teclado_básico_p10_i2.jpeg',
              imagePlacement: 'afterContent',
            },
            {
              title: 'Quando descartar a substituição',
              content: 'Descarte a substituição quando o teclado usa frame ou encaixe acoplado e a disposição das teclas não bate com os espaços físicos.\n\nDiferenças no Enter, Shift, Ç e ? são sinais de atenção.\n\nEm caso de dúvida, solicitar foto do teclado antigo ajuda a confirmar layout e encaixe.',
              image: '/images/teclado/teclado_intermediario_p7_i4.jpeg',
              imagePlacement: 'afterContent',
            },
            {
              title: 'Pointstick e variações antigas',
              content: 'Pointstick, TrackPoint ou TouchStick é um sistema antigo com botão entre teclas que funciona como sensor de movimento do cursor.\n\nHoje ele foi substituído pelo touchpad na maioria dos equipamentos, mas ainda pode aparecer em modelos específicos.\n\nSe o teclado antigo possui esse recurso, a substituição precisa considerar essa característica.',
              image: '/images/teclado/teclado_intermediario_p6_i2.jpeg',
              imagePlacement: 'afterContent',
            },
            {
              title: 'Checklist de atendimento',
              content: 'Antes de indicar o teclado, confirme modelo do notebook, layout, presença de frame, tipo de encaixe, cabo flat, backlight, teclado numérico e funções especiais.\n\nQuando houver mais de uma opção no site, use referências visuais como posição da tecla Wi-Fi e compare com o teclado antigo do cliente.\n\nA peça mais segura é a que replica o teclado original.',
              image: '/images/teclado/teclado_básico_p10_i3.jpeg',
              imagePlacement: 'afterContent',
            },
          ],
          quiz: {
            title: 'Quiz: Teclados - Nível Avançado',
            questions: [
              {
                id: 'teclados-avancado-q1',
                question: 'Em que condição um layout diferente pode ser aceito com mais segurança?',
                options: [
                  'Peça inteira encaixa sem depender de frame rígido',
                  'Teclado usa frame com recortes diferentes',
                  'Enter e Shift não batem com a carcaça',
                  'Cliente não sabe o modelo do notebook'
                ],
                correctAnswer: 0,
                explanation: 'Sem frame rígido, há mais margem para substituição física, desde que o cliente aceite a mudança de layout.'
              },
              {
                id: 'teclados-avancado-q2',
                question: 'Qual sinal exige atenção em troca entre BR e US?',
                options: [
                  'Formato diferente do Enter ou Shift',
                  'Fonte bivolt',
                  'SSD de 500MB/s',
                  'Tela de 15,6 polegadas'
                ],
                correctAnswer: 0,
                explanation: 'Enter e Shift diferentes podem não encaixar no frame ou na carcaça.'
              },
              {
                id: 'teclados-avancado-q3',
                question: 'O que é pointstick?',
                options: [
                  'Sensor antigo entre teclas para mover o cursor',
                  'Conector de fonte Apple',
                  'Tipo de memória RAM',
                  'Modelo de SSD NVMe'
                ],
                correctAnswer: 0,
                explanation: 'Pointstick também é chamado de TrackPoint ou TouchStick.'
              },
              {
                id: 'teclados-avancado-q4',
                question: 'Qual ação ajuda quando há dúvida de layout ou encaixe?',
                options: [
                  'Solicitar foto do teclado antigo',
                  'Ignorar a disposição das teclas',
                  'Escolher pelo preço menor sem análise',
                  'Trocar por qualquer topcase'
                ],
                correctAnswer: 0,
                explanation: 'Fotos permitem comparar Enter, Shift, frame, flat e recursos visuais.'
              },
              {
                id: 'teclados-avancado-q5',
                question: 'Qual é a opção comercial mais segura?',
                options: [
                  'Replicar o teclado original do cliente',
                  'Sempre mudar BR para US',
                  'Ignorar backlight',
                  'Vender teclado sem verificar cabo flat'
                ],
                correctAnswer: 0,
                explanation: 'O teclado idêntico reduz risco de incompatibilidade e frustração do cliente.'
              },
              {
                id: 'teclados-avancado-q6',
                question: 'Qual item deve entrar no checklist quando o cliente menciona teclado iluminado?',
                options: [
                  'Presença do cabo de backlight',
                  'Taxa de atualização da tela',
                  'Altura do caddy',
                  'Voltagem da fonte'
                ],
                correctAnswer: 0,
                explanation: 'Teclado com iluminação precisa do cabo específico de backlight para manter a função.'
              },
              {
                id: 'teclados-avancado-q7',
                question: 'Por que o símbolo impresso na tecla de função pode não corresponder ao comportamento real?',
                options: [
                  'Porque o notebook executa a função mapeada para o teclado original',
                  'Porque a bateria altera as teclas',
                  'Porque o SSD define o Wi-Fi',
                  'Porque todo teclado novo remapeia o Windows'
                ],
                correctAnswer: 0,
                explanation: 'A função esperada pelo notebook pode permanecer a do teclado antigo, mesmo com ícone diferente na tecla.'
              },
              {
                id: 'teclados-avancado-q8',
                question: 'Qual caso exige validar um recurso antigo pouco comum no teclado?',
                options: [
                  'Quando o teclado antigo possui Pointstick/TrackPoint',
                  'Quando a fonte é de 65W',
                  'Quando a tela é LED Slim',
                  'Quando a memória é DDR4'
                ],
                correctAnswer: 0,
                explanation: 'Pointstick é uma característica específica que deve ser considerada para não perder função no equipamento.'
              }
            ]
          }
        }
      }
    ]
  };

