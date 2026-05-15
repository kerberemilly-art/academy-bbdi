export const telasModule = {
    id: 3,
    title: 'Telas',
    icon: 'Monitor',
    color: '#8b5cf6',
    description: 'Trilha para identificar telas de notebook por tamanho, iluminação, resolução, pinagem, encaixe e variações especiais.',
    levels: [
      {
        id: 'basico',
        title: 'Básico',
        description: 'Cinco critérios essenciais para identificar uma tela de notebook.',
        lesson: {
          steps: [
            {
              title: 'Características principais',
              content: 'A tela é a principal forma de apresentação das informações do notebook.\n\nPara identificar corretamente uma tela, comece por cinco critérios básicos: tamanho, tipo de iluminação, resolução, pinagem e tipo de encaixe ou suporte.\n\nEsses critérios formam a base da compatibilidade, mas ainda podem existir variações adicionais em modelos mais específicos.',
            },
            {
              title: 'Tamanho e iluminação',
              content: 'O tamanho da tela é medido em polegadas. Há modelos de 10,1 até 17,3 polegadas, mas os mais comuns são 14,0 e 15,6 polegadas.\n\nA iluminação, ou backlight, pode ser CCFL, LED ou LED Slim.\n\nCCFL: tecnologia antiga com lâmpada fluorescente e cabo extra de alimentação.\n\nLED: usa LEDs e recebe energia pelo cabo flat.\n\nLED Slim: evolução mais fina do LED, com placa PCB na parte inferior e conector geralmente na parte de baixo da tela.',
            },
            {
              title: 'Resolução e pinagem',
              content: 'Resolução é a quantidade de pixels da tela. Quanto maior a quantidade de pixels, maior a definição de imagem.\n\nExemplo: 1366 x 768 indica 1366 colunas por 768 linhas de pixels.\n\nAs resoluções mais comuns em notebook são HD 1366 x 768 e Full HD 1920 x 1080.\n\nA pinagem é o conector usado pelo cabo flat. Os padrões mais comuns são 30 pinos e 40 pinos.',
            },
            {
              title: 'Encaixe, brackets e Part Number',
              content: 'O encaixe da tela na carcaça pode usar suportes laterais, superiores, inferiores ou não ter suporte. Esses suportes são chamados de brackets.\n\nO Part Number é a forma mais segura de validar compatibilidade. Ele fica na parte traseira da tela, então normalmente é preciso remover a tela do notebook para consultar.\n\nPode haver mais de um Part Number com características equivalentes, por causa de fabricantes diferentes em lotes diferentes. Nesses casos, compare as características técnicas.',
            },
          ],
          quiz: {
            title: 'Quiz: Telas - Nível Básico',
            questions: [
              {
                id: 'telas-basico-q1',
                question: 'Quais são os cinco critérios básicos para identificar uma tela?',
                options: [
                  'Tamanho, iluminação, resolução, pinagem e encaixe',
                  'Cor, peso, marca, teclado e bateria',
                  'Fonte, carregador, touchpad, mouse e cabo',
                  'Sistema operacional, senha, Wi-Fi, webcam e áudio'
                ],
                correctAnswer: 0,
                explanation: 'Esses são os critérios iniciais de compatibilidade citados no treinamento.'
              },
              {
                id: 'telas-basico-q2',
                question: 'Qual tipo de tela antiga possui cabo extra de alimentação do backlight?',
                options: [
                  'CCFL',
                  'LED Slim',
                  'IPS',
                  'Narrow frame'
                ],
                correctAnswer: 0,
                explanation: 'Telas CCFL usam lâmpada fluorescente e cabo específico de alimentação.'
              },
              {
                id: 'telas-basico-q3',
                question: 'Qual é uma diferença básica entre LED e LED Slim?',
                options: [
                  'LED Slim costuma ter conector na parte inferior da tela',
                  'LED Slim sempre usa lâmpada fluorescente',
                  'LED não usa cabo flat',
                  'LED é sempre touch'
                ],
                correctAnswer: 0,
                explanation: 'O treinamento destaca a posição do conector como diferença visual importante.'
              },
              {
                id: 'telas-basico-q4',
                question: 'Quais pinagens são comuns em telas de notebook?',
                options: [
                  '30 e 40 pinos',
                  '2 e 3 pinos',
                  '95 e 127 pinos',
                  'DDR3 e DDR4'
                ],
                correctAnswer: 0,
                explanation: '30 e 40 pinos são os conectores básicos citados no material.'
              },
              {
                id: 'telas-basico-q5',
                question: 'Onde normalmente fica o Part Number da tela?',
                options: [
                  'Na parte traseira da tela',
                  'Na fonte do notebook',
                  'Na tecla Enter',
                  'No cabo de energia da tomada'
                ],
                correctAnswer: 0,
                explanation: 'Por ficar atrás da tela, muitas vezes é necessário remover a peça para consultar.'
              },
              {
                id: 'telas-basico-q6',
                question: 'Qual tamanho de tela é citado como um dos mais comercializados?',
                options: [
                  '15,6 polegadas',
                  '8,0 polegadas',
                  '21,5 polegadas',
                  '27,0 polegadas'
                ],
                correctAnswer: 0,
                explanation: 'O material destaca 14,0 e 15,6 polegadas como tamanhos muito comercializados em notebooks.'
              },
              {
                id: 'telas-basico-q7',
                question: 'Uma tela com apenas o cabo flat traseiro, sem cabo extra de lâmpada, tende a ser qual tecnologia?',
                options: [
                  'LED',
                  'CCFL',
                  'Fonte tripolar',
                  'DDR3L'
                ],
                correctAnswer: 0,
                explanation: 'Nas telas LED, a alimentação da iluminação passa pelo próprio cabo flat, sem cabo extra de CCFL.'
              },
              {
                id: 'telas-basico-q8',
                question: 'Por que duas telas com Part Numbers diferentes ainda podem ser compatíveis?',
                options: [
                  'Porque fabricantes diferentes podem produzir telas com as mesmas características',
                  'Porque o Part Number nunca importa',
                  'Porque toda tela de 15,6 polegadas é igual',
                  'Porque a fonte define a compatibilidade da tela'
                ],
                correctAnswer: 0,
                explanation: 'Lotes e fabricantes diferentes podem gerar Part Numbers distintos para telas equivalentes, desde que as características batam.'
              }
            ]
          }
        }
      },
      {
        id: 'intermediario',
        title: 'Intermediário',
        description: 'Ferramentas de comparação, IPS/TN, narrow frame e touch screen.',
        lesson: {
          steps: [
            {
              title: 'Ferramentas de identificação',
              content: 'A identificação pode começar pela planilha de telas, filtrando características como tamanho, iluminação, resolução e pinagem.\n\nAo filtrar esses parâmetros, normalmente restam apenas variações adicionais, como suportes, IPS ou narrow frame.\n\nPara comparar Part Numbers ou modelos informados pelo cliente, use ferramentas como LaptopScreen para visão comercial e Panelook para análise mais técnica.',
            },
            {
              title: 'IPS x TN',
              content: 'Telas IPS oferecem melhor qualidade de imagem e cores em comparação com telas TN mais antigas.\n\nA diferença técnica está no alinhamento dos pixels: TN usa alinhamento vertical, enquanto IPS usa alinhamento horizontal.\n\nQuando o modelo for IPS, essa informação costuma aparecer em bases de consulta como LaptopScreen.',
            },
            {
              title: 'Narrow frame',
              content: 'Telas narrow frame são modelos de borda fina ou borda infinita, comuns em notebooks mais compactos.\n\nApesar de parecerem maiores visualmente, suas dimensões físicas são menores que as telas convencionais, em torno de alguns milímetros.\n\nModelos que usam narrow frame não devem ser substituídos por telas convencionais, pois o encaixe e as dimensões não batem.',
            },
            {
              title: 'Touch screen',
              content: 'Telas touch em notebooks podem ter o touch separado da tela ou acoplado à tela.\n\nA BBDI trabalha com modelos em que o touch já vem acoplado à tela.\n\nNo material, os modelos touch disponíveis são de 14,0 e 15,6 polegadas e usam conectores de 40 pinos.',
            },
          ],
          quiz: {
            title: 'Quiz: Telas - Nível Intermediário',
            questions: [
              {
                id: 'telas-intermediario-q1',
                question: 'Qual ferramenta é mais indicada para comparação técnica detalhada de telas?',
                options: [
                  'Panelook',
                  'Calculadora do Windows',
                  'Gerenciador de Tarefas',
                  'Bloco de Notas'
                ],
                correctAnswer: 0,
                explanation: 'O Panelook traz dados técnicos mais detalhados, útil para narrow, touch e especificações finas.'
              },
              {
                id: 'telas-intermediario-q2',
                question: 'O que diferencia uma tela IPS de uma TN no atendimento?',
                options: [
                  'IPS oferece melhor imagem e cores',
                  'IPS sempre usa fonte de 90W',
                  'TN é sempre touch',
                  'Não há diferença perceptível'
                ],
                correctAnswer: 0,
                explanation: 'IPS é uma tecnologia associada a melhor qualidade visual.'
              },
              {
                id: 'telas-intermediario-q3',
                question: 'Por que uma tela narrow frame não deve ser trocada por uma convencional?',
                options: [
                  'Porque possui dimensões menores e encaixe diferente',
                  'Porque always usa CCFL',
                  'Porque não tem pixels',
                  'Porque só funciona com teclado US'
                ],
                correctAnswer: 0,
                explanation: 'A dimensão física e os suportes podem não bater com a carcaça.'
              },
              {
                id: 'telas-intermediario-q4',
                question: 'Quais tamanhos e pinagem são citados para telas touch trabalhadas no material?',
                options: [
                  '14,0 e 15,6 polegadas, com 40 pinos',
                  '10,1 e 17,3 polegadas, com 30 pinos',
                  'Apenas 13,3 polegadas, com 20 pinos',
                  'Qualquer tamanho, com 2 pinos'
                ],
                correctAnswer: 0,
                explanation: 'O material limita os modelos touch trabalhados a 14,0 e 15,6 polegadas com 40 pinos.'
              },
              {
                id: 'telas-intermediario-q5',
                question: 'Ao filtrar tamanho, iluminação, resolução e pinagem na planilha, o que tende a sobrar?',
                options: [
                  'Variações de suporte, IPS, narrow ou outras características especiais',
                  'Apenas fontes de notebook',
                  'Somente teclados com frame',
                  'Nenhuma possibilidade de comparação'
                ],
                correctAnswer: 0,
                explanation: 'Os filtros básicos reduzem a lista e deixam variações específicas para análise final.'
              },
              {
                id: 'telas-intermediario-q6',
                question: 'Qual é a melhor sequência ao comparar uma tela informada pelo cliente com um modelo da empresa?',
                options: [
                  'Comparar Part Number e características técnicas em bases confiáveis',
                  'Escolher apenas pelo preço',
                  'Comparar somente a marca do notebook',
                  'Ignorar resolução quando o tamanho for igual'
                ],
                correctAnswer: 0,
                explanation: 'A comparação precisa validar tamanho, resolução, pinagem, tecnologia e variações especiais.'
              },
              {
                id: 'telas-intermediario-q7',
                question: 'Qual característica visual define as telas narrow frame?',
                options: [
                  'Bordas menores e mais finas',
                  'Cabo de fonte bipolar',
                  'Tecla Ç no teclado',
                  'Conector Magsafe'
                ],
                correctAnswer: 0,
                explanation: 'Narrow frame são telas de borda fina, comuns em notebooks compactos.'
              },
              {
                id: 'telas-intermediario-q8',
                question: 'Em tela touch trabalhada pela BBDI, como o touch costuma vir?',
                options: [
                  'Acoplado à tela',
                  'Sempre separado da tela',
                  'No cabo da fonte',
                  'No teclado numérico'
                ],
                correctAnswer: 0,
                explanation: 'O material informa que a empresa trabalha com modelos em que o touch já vem acoplado.'
              }
            ]
          }
        }
      },
      {
        id: 'avancado',
        title: 'Avançado',
        description: 'Narrow frame com brackets, taxa de atualização, troca de resolução e casos de incompatibilidade.',
        lesson: {
          steps: [
            {
              title: 'Narrow frame e brackets',
              content: 'Telas narrow frame podem ter ou não suportes, também chamados de brackets.\n\nNa maioria dos casos é possível identificar essa informação pelo Part Number, mas há suportes removíveis. Por isso, o físico pode divergir da compatibilidade cadastrada.\n\nA melhor forma de confirmar é solicitar fotos da tela antiga ao cliente quando houver dúvida.',
            },
            {
              title: 'Taxa de atualização',
              content: 'A taxa de atualização indica quantas vezes a imagem é atualizada por segundo e é medida em Hertz (Hz).\n\nUsuários comuns normalmente não percebem tanta diferença, mas usuários de jogos valorizam taxas maiores.\n\nA maioria dos notebooks comerciais usa 60Hz. Para confirmar a taxa, identifique o Part Number original da tela em estoque e consulte no Panelook.',
            },
            {
              title: 'Troca entre HD e Full HD',
              content: 'As resoluções mais comuns são HD 1366 x 768 e Full HD 1920 x 1080.\n\nTrocar Full HD por HD geralmente funciona, mas a qualidade cai e o cliente tende a perceber a diferença.\n\nTrocar HD por Full HD pode parecer atrativo, mas depende de suporte da máquina. Muitos notebooks não suportam a quantidade maior de pixels e podem apagar a tela ou desligar.',
            },
            {
              title: 'Caso B140XW02-V.1',
              content: 'O modelo B140XW02-V.1 atende muitos notebooks, mas há exceções.\n\nB140XW02-V.1: compatível com vários modelos, exceto alguns Dell e Lenovo S400.\n\nB140XW03-V.0: compatível com modelos Dell nesse caso.\n\nN140BGE-LB2: compatível com Lenovo S400.\n\nEsse caso reforça que Part Number equivalente e aplicação por modelo precisam ser validados juntos.',
            },
            {
              title: 'Como ler Part Numbers de tela',
              content: 'Part Numbers de tela ajudam a entender fabricante, tamanho, resolução, tecnologia e revisão.\n\nExemplo: B156XW04-V.8 pode ser lido como fabricante AUO, tela 15,6 polegadas, resolução HD e revisão específica.\n\nPrefixos comuns incluem B, LP, LTN, NV, LQ, CLAA e N. Sufixos podem indicar revisão, mudanças elétricas, pinos, acabamento, brilho ou interface.\n\nEssa leitura é apoio técnico, mas deve ser combinada com consulta de compatibilidade.',
            },
          ],
          quiz: {
            title: 'Quiz: Telas - Nível Avançado',
            questions: [
              {
                id: 'telas-avancado-q1',
                question: 'Quando houver dúvida sobre brackets em narrow frame, qual ação é mais segura?',
                options: [
                  'Solicitar fotos da tela antiga ao cliente',
                  'Ignorar os suportes',
                  'Vender uma tela convencional',
                  'Escolher apenas pela resolução'
                ],
                correctAnswer: 0,
                explanation: 'Como suportes podem ser removíveis, a foto ajuda a validar o físico real.'
              },
              {
                id: 'telas-avancado-q2',
                question: 'Qual taxa de atualização é mais comum em notebooks comerciais?',
                options: [
                  '60Hz',
                  '144Hz',
                  '240Hz',
                  '500Hz'
                ],
                correctAnswer: 0,
                explanation: 'O treinamento indica 60Hz como padrão mais comum nos modelos comerciais.'
              },
              {
                id: 'telas-avancado-q3',
                question: 'Qual risco existe ao trocar tela HD por Full HD sem validação?',
                options: [
                  'O notebook pode não suportar a resolução maior',
                  'A fonte vira USB-C automaticamente',
                  'O teclado perde o Enter',
                  'A bateria muda de Part Number'
                ],
                correctAnswer: 0,
                explanation: 'A placa/cabo/equipamento pode não suportar o dobro de pixels.'
              },
              {
                id: 'telas-avancado-q4',
                question: 'No caso B140XW02-V.1, qual modelo é citado para Lenovo S400?',
                options: [
                  'N140BGE-LB2',
                  'B156XW04-V.8',
                  'LP156WF9-SPK1',
                  'BB20-AP65-M2'
                ],
                correctAnswer: 0,
                explanation: 'O material aponta N140BGE-LB2 como compatível com Lenovo S400.'
              },
              {
                id: 'telas-avancado-q5',
                question: 'O que um sufixo ou revisão em Part Number pode indicar?',
                options: [
                  'Mudanças elétricas, pinos, interface, brilho ou acabamento',
                  'Somente a cor da tampa do notebook',
                  'O idioma do teclado',
                  'A potência da fonte'
                ],
                correctAnswer: 0,
                explanation: 'Revisões podem alterar detalhes técnicos relevantes para compatibilidade.'
              },
              {
                id: 'telas-avancado-q6',
                question: 'Por que trocar uma tela Full HD por HD pode gerar cancelamento da compra?',
                options: [
                  'Porque a qualidade da imagem cai e o cliente percebe a diferença',
                  'Porque HD sempre queima a placa',
                  'Porque a tela HD não possui pixels',
                  'Porque muda automaticamente o layout do teclado'
                ],
                correctAnswer: 0,
                explanation: 'Mesmo funcionando em muitos casos, a redução de resolução pode frustrar o cliente pela perda de qualidade.'
              },
              {
                id: 'telas-avancado-q7',
                question: 'Como confirmar a taxa de atualização de uma tela do estoque?',
                options: [
                  'Identificar o Part Number do fabricante e consultar no Panelook',
                  'Medir a tela com régua apenas pela largura',
                  'Usar a potência da fonte',
                  'Verificar se o teclado tem backlight'
                ],
                correctAnswer: 0,
                explanation: 'O treinamento orienta consultar o Part Number do fabricante em base técnica para confirmar Hz.'
              },
              {
                id: 'telas-avancado-q8',
                question: 'Qual dado do Part Number B156XW04-V.8 indica tamanho de tela?',
                options: [
                  '156',
                  'V.8',
                  'XW',
                  'B'
                ],
                correctAnswer: 0,
                explanation: 'No exemplo, 156 indica tela de 15,6 polegadas.'
              }
            ]
          }
        }
      },
      {
        id: 'part-numbers',
        title: 'Part Numbers',
        description: 'Leitura técnica de Part Numbers, fabricantes, tecnologia, resolução e revisões de tela.',
        lesson: {
          steps: [
            {
              title: 'O que é um Part Number de tela',
              content: 'Part Numbers de tela são códigos atribuídos a modelos específicos de painéis.\n\nEles são usados para identificação técnica e ajudam a garantir compatibilidade, facilitar manutenção e evitar compras incorretas.\n\nAlém de identificar o modelo, o Part Number pode revelar tecnologia, tamanho, resolução, fabricante, versão e revisão da tela.',
            },
            {
              title: 'Por que Part Numbers são importantes',
              content: 'O Part Number ajuda a confirmar se uma tela é realmente compatível com o notebook do cliente.\n\nEle facilita a comparação entre modelos equivalentes, orienta compras corretas e permite entender diferenças de tecnologia ou revisão.\n\nNa prática, ele não substitui a análise completa. O atendimento ainda precisa validar tamanho, resolução, pinagem, encaixe, tipo de painel e variações físicas.',
            },
            {
              title: 'Como desmembrar um Part Number',
              content: 'Um Part Number costuma trazer vários blocos de informação.\n\nPrefixo alfabético: indica fabricante ou padrão interno. Exemplos comuns: B, LP, LTN, NV, LQ, CLAA e N.\n\nTamanho da tela: aparece em décimos de polegada. Exemplo: 140 indica 14,0 polegadas; 156 indica 15,6 polegadas.\n\nResolução ou tecnologia: aparece como abreviação técnica, como XW, WF, WH, FHM, QAN, HAN, HL, JW, WFG ou UHD.\n\nCódigo variante: diferencia modelos dentro da mesma série.\n\nSufixo ou revisão: indica versão técnica, atualização, acabamento, controle, brilho, interface, pinos ou mudanças elétricas.',
            },
            {
              title: 'Exemplo prático: B156XW04-V.8',
              content: 'No exemplo B156XW04-V.8, cada trecho ajuda a entender a tela.\n\nB: fabricante AU Optronics, também conhecido como AUO.\n\n156: tamanho de 15,6 polegadas.\n\nXW: padrão de resolução HD 1366 x 768 em nomenclatura AUO.\n\nW: painel widescreen, com proporção 16:9.\n\n04: versão específica dentro da série.\n\nV.8: revisão específica da tela.\n\nEsse tipo de leitura acelera a análise, mas a compatibilidade final deve ser validada em base técnica e pela aplicação no notebook.',
            },
            {
              title: 'Fabricantes e prefixos comuns',
              content: 'Alguns prefixos aparecem com frequência em Part Numbers de tela.\n\nB: exemplo B156XW02-V.2.\n\nLP: exemplo LP156WF9-SPK1.\n\nLTN: exemplo LTN156HL01-102.\n\nNV: exemplo NV140FHM-N4K.\n\nLQ: exemplo LQ154K1LA0A.\n\nCLAA: exemplo CLAA133WA01A.\n\nN: exemplo N156HCA-EBA.\n\nEsses prefixos ajudam a reconhecer o padrão do fabricante, mas não devem ser usados isoladamente para decidir compatibilidade.',
            },
            {
              title: 'Tecnologia e resolução no código',
              content: 'Alguns segmentos indicam resolução ou tecnologia do painel.\n\nXW: HD 1366 x 768, comum em modelos AUO.\n\nWF: Full HD, IPS ou TN, Wide Full HD.\n\nWH: HD, TN, comum em modelos antigos.\n\nFHM: Full HD, IPS ou TN, geralmente fosco.\n\nQAN: QHD, IPS, painel premium.\n\nHAN: Full HD, IPS, eDP 30 ou 40 pinos.\n\nHL: Full HD, TN ou IPS, normalmente LED.\n\nJW: QHD, painel TN.\n\nWFG: Full HD com variações de tecnologia e resolução.\n\nUHD: 4K Ultra HD, normalmente IPS ou OLED.',
            },
            {
              title: 'Revisões e sufixos',
              content: 'Sufixos e revisões podem indicar diferenças importantes.\n\nEAB, EA1 e EAC podem indicar configurações de pinos.\n\nSPB1, SPB2 e SPK1 podem indicar revisões com mudanças elétricas ou de pinos.\n\nTLN1, TLA1 e TLB1 podem indicar diferenças sutis de acabamento ou controle.\n\nN4K, N4B, N4G e N3E podem indicar revisão com variações de frequência, brilho ou interface.\n\nA01, A02 e A03 podem indicar versões internas de engenharia.\n\n101, 102 e 203 podem indicar mudanças de conector ou interface.\n\nJW31, JW33 e JW37 podem indicar diferenças de brilho ou backlight.\n\nE01 e EB1 podem indicar revisões usadas em séries especiais para fabricantes como HP e Lenovo.',
            },
            {
              title: 'Como usar Part Number no atendimento',
              content: 'Use o Part Number como ponto de partida técnico para consultar equivalências, validar revisões e comparar características.\n\nSe dois Part Numbers forem parecidos, mas tiverem sufixos diferentes, não assuma compatibilidade automaticamente.\n\nCompare resolução, pinagem, interface, brilho, tecnologia do painel, tamanho físico, brackets, posição do conector e aplicação no notebook.\n\nQuando houver dúvida entre revisões, a decisão mais segura é confirmar em base técnica e, se necessário, pedir foto da tela antiga ou consultar o estoque pelo Part Number do fabricante.',
            },
          ],
          quiz: {
            title: 'Quiz: Telas - Part Numbers',
            questions: [
              {
                id: 'telas-pn-q1',
                question: 'Para que serve um Part Number de tela?',
                options: [
                  'Para identificação técnica de um modelo específico de tela',
                  'Para definir a potência da fonte',
                  'Para escolher layout de teclado',
                  'Para indicar capacidade de memória RAM'
                ],
                correctAnswer: 0,
                explanation: 'O Part Number é o código técnico usado para identificar modelos específicos de painel.'
              },
              {
                id: 'telas-pn-q2',
                question: 'Por que Part Numbers são importantes na venda de telas?',
                options: [
                  'Ajudam a garantir compatibilidade e compras corretas',
                  'Substituem qualquer análise de pinagem',
                  'Servem apenas para saber a cor da tela',
                  'Indicam sempre o preço final do produto'
                ],
                correctAnswer: 0,
                explanation: 'Eles ajudam na identificação, manutenção e compra correta, mas ainda exigem validação técnica.'
              },
              {
                id: 'telas-pn-q3',
                question: 'No Part Number B156XW04-V.8, o que significa 156?',
                options: [
                  'Tela de 15,6 polegadas',
                  'Tela de 156Hz',
                  'Potência de 156W',
                  'Conector de 156 pinos'
                ],
                correctAnswer: 0,
                explanation: 'O tamanho costuma aparecer em décimos de polegada. 156 indica 15,6 polegadas.'
              },
              {
                id: 'telas-pn-q4',
                question: 'No exemplo B156XW04-V.8, o prefixo B indica qual fabricante citado no material?',
                options: [
                  'AU Optronics (AUO)',
                  'Apple',
                  'Dell',
                  'Kingston'
                ],
                correctAnswer: 0,
                explanation: 'No exemplo do material, B é associado à AU Optronics, também chamada de AUO.'
              },
              {
                id: 'telas-pn-q5',
                question: 'Qual interpretação está correta para o segmento XW?',
                options: [
                  'HD 1366 x 768 em padrão AUO',
                  '4K OLED obrigatoriamente',
                  'Conector USB-C',
                  'Tela touch acoplada'
                ],
                correctAnswer: 0,
                explanation: 'XW é citado como padrão AUO para HD 1366 x 768.'
              },
              {
                id: 'telas-pn-q6',
                question: 'O que um sufixo como SPK1, V.8 ou N4K pode indicar?',
                options: [
                  'Revisão, versão técnica ou diferença de construção',
                  'Idioma do teclado',
                  'Capacidade da bateria',
                  'Altura do caddy'
                ],
                correctAnswer: 0,
                explanation: 'Sufixos e revisões podem representar mudanças elétricas, pinos, brilho, interface ou acabamento.'
              },
              {
                id: 'telas-pn-q7',
                question: 'Se duas telas têm Part Numbers parecidos, mas revisões diferentes, qual atitude é correta?',
                options: [
                  'Comparar características técnicas antes de confirmar compatibilidade',
                  'Assumir que são sempre iguais',
                  'Ignorar pinagem e interface',
                  'Escolher apenas a mais barata'
                ],
                correctAnswer: 0,
                explanation: 'Revisões podem mudar detalhes relevantes. A comparação técnica evita incompatibilidade.'
              },
              {
                id: 'telas-pn-q8',
                question: 'Qual bloco do Part Number costuma indicar fabricante ou padrão interno?',
                options: [
                  'Prefixo alfabético',
                  'Capacidade em Wh',
                  'Altura em milímetros',
                  'Tecla de função'
                ],
                correctAnswer: 0,
                explanation: 'Prefixos como B, LP, LTN, NV, LQ, CLAA e N ajudam a reconhecer o padrão do fabricante.'
              },
              {
                id: 'telas-pn-q9',
                question: 'Qual segmento pode estar associado a Full HD, IPS ou TN, em Wide Full HD?',
                options: [
                  'WF',
                  'DDR3L',
                  'M2',
                  'CCFL'
                ],
                correctAnswer: 0,
                explanation: 'WF aparece no material como segmento ligado a Full HD, IPS ou TN em padrão Wide Full HD.'
              },
              {
                id: 'telas-pn-q10',
                question: 'Qual é a melhor forma de usar Part Number no atendimento?',
                options: [
                  'Como ponto de partida técnico, junto com validação de resolução, pinagem, interface e físico',
                  'Como único dado necessário em qualquer caso',
                  'Apenas para saber se a tela tem teclado numérico',
                  'Somente para escolher fonte compatível'
                ],
                correctAnswer: 0,
                explanation: 'O Part Number é essencial, mas a decisão segura combina código, ficha técnica e aplicação no notebook.'
              }
            ]
          }
        }
      }
    ]
  };

