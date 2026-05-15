export const fontesModule = {
    id: 2,
    title: 'Fontes',
    icon: 'Zap',
    color: '#10b981',
    description: 'Trilha para identificar fontes de notebook por tensão, corrente, potência, conector e casos especiais.',
    levels: [
      {
        id: 'basico',
        title: 'Básico',
        description: 'Função da fonte, características principais, potência, cabos e pinos de conexão.',
        lesson: {
          steps: [
            {
              title: 'Função da fonte',
              content: 'A fonte para notebook, também chamada de carregador, converte a energia alternada da tomada em energia contínua adequada ao equipamento.\n\nA entrada normalmente é bivolt, na faixa de 100V a 240V. A saída costuma variar entre 15V e 24V, conforme o modelo do notebook.\n\nSem a fonte correta, o notebook pode não ligar, não carregar a bateria ou apresentar falhas de alimentação.',
            },
            {
              title: 'Características de identificação',
              content: 'Para identificar uma fonte corretamente, observe quatro critérios principais:\n\nVoltagem: tensão de saída da fonte, indicada em V.\n\nAmperagem: corrente fornecida pela fonte, indicada em A.\n\nPotência: resultado da multiplicação entre voltagem e amperagem, indicada em W.\n\nPino de conexão: formato físico do conector que entra no notebook.',
            },
            {
              title: 'Potência da fonte',
              content: 'A potência de uma fonte é calculada da mesma forma que em baterias:\n\nW = V x A\n\nModelos comuns de notebook usam fontes de 65W a 90W. Equipamentos com maior demanda de energia podem usar 120W, 150W ou até potências próximas de 280W.\n\nExemplo: uma fonte de 20V e 3,25A entrega 65W.',
            },
            {
              title: 'Cabos e pinos',
              content: 'O cabo que liga a fonte à tomada pode ser bipolar ou tripolar. Isso não define a compatibilidade da fonte com o notebook.\n\nO ponto crítico é o pino de conexão. Ele pode variar por marca, modelo e geração.\n\nA medição do conector considera o diâmetro externo e o diâmetro interno. Também existem conectores macho e fêmea, dependendo de onde fica o pino físico.',
            },
          ],
          quiz: {
            title: 'Quiz: Fontes - Nível Básico',
            questions: [
              {
                id: 'fontes-basico-q1',
                question: 'Qual é a função principal da fonte de notebook?',
                options: [
                  'Armazenar energia para uso fora da tomada',
                  'Converter energia da tomada para energia contínua adequada ao notebook',
                  'Aumentar a memória RAM',
                  'Controlar a resolução da tela'
                ],
                correctAnswer: 1,
                explanation: 'A fonte converte a energia alternada da tomada para a energia contínua usada pelo notebook.'
              },
              {
                id: 'fontes-basico-q2',
                question: 'Quais informações são essenciais para identificar uma fonte?',
                options: [
                  'Voltagem, amperagem, potência e pino de conexão',
                  'Cor, peso e marca da mochila',
                  'Sistema operacional e senha do usuário',
                  'Tamanho da tela e idioma do teclado'
                ],
                correctAnswer: 0,
                explanation: 'Esses quatro critérios reduzem erro de compatibilidade na fonte.'
              },
              {
                id: 'fontes-basico-q3',
                question: 'Como calcular a potência de uma fonte?',
                options: [
                  'W = V x A',
                  'W = V / A',
                  'W = pino x cabo',
                  'W = entrada + saída'
                ],
                correctAnswer: 0,
                explanation: 'Potência em watts é o resultado da multiplicação entre voltagem e amperagem.'
              },
              {
                id: 'fontes-basico-q4',
                question: 'O cabo bipolar ou tripolar influencia na compatibilidade da fonte com o notebook?',
                options: [
                  'Sim, define a voltagem de saída',
                  'Não, o que importa para o notebook é a especificação da fonte e o conector',
                  'Sim, define a resolução da tela',
                  'Sim, sempre muda o pino do notebook'
                ],
                correctAnswer: 1,
                explanation: 'O cabo de tomada não define a compatibilidade elétrica e física entre fonte e notebook.'
              },
              {
                id: 'fontes-basico-q5',
                question: 'Por que o pino de conexão é um ponto crítico na venda de fontes?',
                options: [
                  'Porque pode variar por marca e modelo mesmo com potência parecida',
                  'Porque sempre é igual em todos os notebooks',
                  'Porque substitui a análise de voltagem',
                  'Porque define a capacidade da bateria'
                ],
                correctAnswer: 0,
                explanation: 'Duas fontes podem ter potência parecida e pinos diferentes, impedindo o encaixe ou reconhecimento.'
              },
              {
                id: 'fontes-basico-q6',
                question: 'Uma fonte informa saída de 19V e 3,42A. Qual potência aproximada ela entrega?',
                options: [
                  '45W',
                  '65W',
                  '90W',
                  '150W'
                ],
                correctAnswer: 1,
                explanation: '19 x 3,42 resulta em aproximadamente 65W, uma potência comum para notebooks.'
              },
              {
                id: 'fontes-basico-q7',
                question: 'Qual informação da etiqueta deve ser observada para saber a energia entregue ao notebook?',
                options: [
                  'Output ou saída da fonte',
                  'Apenas o Input 100/240V',
                  'Somente a marca do cabo de tomada',
                  'O idioma impresso no manual'
                ],
                correctAnswer: 0,
                explanation: 'O Input indica entrada da tomada. O Output/saída mostra voltagem e corrente entregues ao notebook.'
              },
              {
                id: 'fontes-basico-q8',
                question: 'Um cliente traz uma fonte com pino visualmente parecido, mas sem etiqueta legível. Qual atitude é mais segura?',
                options: [
                  'Confirmar modelo do notebook e especificações antes de vender',
                  'Vender pela semelhança visual',
                  'Indicar sempre a fonte mais potente',
                  'Usar apenas o tipo do cabo bipolar ou tripolar'
                ],
                correctAnswer: 0,
                explanation: 'Sem especificação clara, a identificação deve voltar ao modelo do notebook, pino correto e parâmetros elétricos.'
              }
            ]
          }
        }
      },
      {
        id: 'intermediario',
        title: 'Intermediário',
        description: 'Uso do site, tabela de pinos, conectores especiais e fontes Apple.',
        lesson: {
          steps: [
            {
              title: 'Analisando uma fonte no site',
              content: 'Ao analisar uma fonte no site da BB Baterias, confirme voltagem, amperagem, potência e pino de conexão.\n\nQuando houver relação Pai e Filho, as duas informações podem aparecer. Mesmo assim, valide se a variação atende ao notebook do cliente.',
            },
            {
              title: 'Tabela de pinos',
              content: 'A tabela de pinos organiza os modelos de fontes pelo tamanho do conector, do menor para o maior.\n\nEla ajuda a identificar o pino correto e também mostra quais fontes compartilham o mesmo pino, mas podem ter variações de voltagem e amperagem.\n\nUse a tabela como apoio de consulta, não como único critério. A fonte correta ainda precisa respeitar especificação elétrica.',
            },
            {
              title: 'Tipos de conectores',
              content: 'Entre os conectores comuns estão pinos agulha, bullet e USB-C.\n\nAgulha: extremamente fino, exige atenção visual.\n\nBullet: possui trava e pode gerar incompatibilidade em alguns casos.\n\nUSB-C: padrão novo usado em diversos equipamentos, mas exige validação de potência e aplicação.',
            },
            {
              title: 'Fontes para Apple MacBook',
              content: 'MacBooks usam conectores diferentes das demais marcas.\n\nMagsafe 1: usado em modelos mais antigos, com pino central menor que os demais.\n\nMagsafe 2: todos os pinos internos têm tamanho semelhante.\n\nUSB-C: usado em modelos mais recentes. A partir desse padrão, a potência e a origem da fonte precisam ser validadas com mais cuidado.',
            },
          ],
          quiz: {
            title: 'Quiz: Fontes - Nível Intermediário',
            questions: [
              {
                id: 'fontes-intermediario-q1',
                question: 'Para que serve a tabela de pinos?',
                options: [
                  'Para organizar fontes por tamanho de conector e ajudar na identificação',
                  'Para calcular a memória RAM',
                  'Para alterar o layout do teclado',
                  'Para escolher a resolução da tela'
                ],
                correctAnswer: 0,
                explanation: 'A tabela facilita a comparação dos conectores e das fontes que usam cada pino.'
              },
              {
                id: 'fontes-intermediario-q2',
                question: 'Qual cuidado permanece necessário mesmo quando duas fontes usam o mesmo pino?',
                options: [
                  'Validar voltagem, amperagem e potência',
                  'Trocar sempre por uma fonte mais fraca',
                  'Ignorar a marca do notebook',
                  'Usar qualquer cabo tripolar'
                ],
                correctAnswer: 0,
                explanation: 'Mesmo pino não garante compatibilidade elétrica.'
              },
              {
                id: 'fontes-intermediario-q3',
                question: 'Qual conector pode ter uma trava que causa incompatibilidade?',
                options: [
                  'Bullet',
                  'HDMI',
                  'VGA',
                  'RJ45'
                ],
                correctAnswer: 0,
                explanation: 'O material destaca o bullet como conector com trava que pode gerar incompatibilidade física.'
              },
              {
                id: 'fontes-intermediario-q4',
                question: 'Qual diferença ajuda a separar Magsafe 1 de Magsafe 2?',
                options: [
                  'Magsafe 1 tem pino central menor; Magsafe 2 tem pinos iguais',
                  'Magsafe 2 usa apenas cabo bipolar',
                  'Magsafe 1 é sempre USB-C',
                  'Não há diferença visual'
                ],
                correctAnswer: 0,
                explanation: 'A comparação dos pinos internos é o principal critério visual citado no treinamento.'
              },
              {
                id: 'fontes-intermediario-q5',
                question: 'Em fontes USB-C, o que deve ser respeitado antes da oferta?',
                options: [
                  'A potência exigida pelo equipamento',
                  'A cor do cabo',
                  'A marca da bateria antiga',
                  'A quantidade de teclas do notebook'
                ],
                correctAnswer: 0,
                explanation: 'Conector igual não basta. Uma fonte USB-C de smartphone pode não atender um notebook.'
              },
              {
                id: 'fontes-intermediario-q6',
                question: 'Na tabela de pinos, por que a ordem por diâmetro ajuda o atendimento?',
                options: [
                  'Facilita comparar conectores próximos e localizar referências BBDI',
                  'Elimina a necessidade de validar potência',
                  'Define automaticamente se a fonte é Apple',
                  'Mostra a capacidade da bateria'
                ],
                correctAnswer: 0,
                explanation: 'A organização por tamanho agiliza a busca, mas a especificação elétrica ainda precisa ser conferida.'
              },
              {
                id: 'fontes-intermediario-q7',
                question: 'Qual cenário indica maior atenção com conectores Apple?',
                options: [
                  'Confundir Magsafe 1, Magsafe 2 e USB-C',
                  'Confundir cabo bipolar com tripolar',
                  'Comparar DDR3 com DDR4',
                  'Medir tela em polegadas'
                ],
                correctAnswer: 0,
                explanation: 'MacBooks usam conectores próprios por geração; identificar o padrão evita venda incorreta.'
              },
              {
                id: 'fontes-intermediario-q8',
                question: 'Quando há relação Pai e Filho no site, o que ainda precisa ser feito?',
                options: [
                  'Validar se a variação atende ao notebook do cliente',
                  'Ignorar as informações do produto Filho',
                  'Vender sempre o Pai, sem comparar',
                  'Trocar a fonte por bateria'
                ],
                correctAnswer: 0,
                explanation: 'Pai e Filho indicam relação de produto, mas a compatibilidade prática deve ser conferida no atendimento.'
              }
            ]
          }
        }
      },
      {
        id: 'avancado',
        title: 'Avançado',
        description: 'Compatibilidades críticas: Dell x HP, variação de voltagem, maior potência, USB-C e casos Sony/Positivo.',
        lesson: {
          steps: [
            {
              title: 'Dell x HP com mesmo diâmetro',
              content: 'Existem fontes Dell e HP com o mesmo diâmetro de pino: 7,4mm x 5,0mm.\n\nMesmo parecendo iguais fisicamente, não são compatíveis entre si. Fontes HP não são reconhecidas em notebooks Dell nesses casos.\n\nEsse é um exemplo claro de que pino físico não deve ser o único critério de venda.',
            },
            {
              title: 'Troca por voltagem diferente',
              content: 'Muitas fontes de notebook ficam entre 18V e 20V e podem ser intercambiáveis quando a potência é respeitada.\n\nExemplo compatível: 20V 3,25A 65W e 19V 3,42A 65W.\n\nDiferenças grandes, como 15V para 19V ou 20V, não são aconselhadas. Mesmo que funcione inicialmente, pode danificar o equipamento com o tempo.\n\nRegra prática do treinamento: substituir apenas quando a diferença for de no máximo 1,5V.',
            },
            {
              title: 'Quando ofertar maior potência',
              content: 'Em alguns casos, pode ser aconselhável substituir uma fonte de 65W por uma de 90W.\n\nIsso pode ocorrer quando o cliente usa uma bateria de capacidade estendida ou quando relata aquecimento excessivo da fonte.\n\nA fonte de 90W pode trabalhar fornecendo os 65W necessários ao notebook, mantendo folga de potência.\n\nNão é uma regra automática. A análise deve considerar o modelo e a necessidade do equipamento.',
            },
            {
              title: 'USB-C e casos especiais',
              content: 'USB-C permite carregar notebooks, tablets e smartphones, mas a potência precisa ser respeitada.\n\nNão é correto usar uma fonte de smartphone de 29W em um notebook que precisa de 65W.\n\nEquipamentos Apple podem exigir fonte compatível com Apple. Por isso, há modelos USB-C específicos para Apple e modelos para demais marcas.\n\nTambém existem casos Sony/Positivo com padrões de pinagem diferentes dos padrões antigos, exigindo validação cuidadosa.',
            },
          ],
          quiz: {
            title: 'Quiz: Fontes - Nível Avançado',
            questions: [
              {
                id: 'fontes-avancado-q1',
                question: 'Fontes Dell e HP com pino 7,4mm x 5,0mm são sempre compatíveis?',
                options: [
                  'Sim, o diâmetro resolve tudo',
                  'Não, a Dell pode não reconhecer fonte HP mesmo com pino igual',
                  'Sim, desde que o cabo seja tripolar',
                  'Sim, se a fonte for preta'
                ],
                correctAnswer: 1,
                explanation: 'O treinamento destaca esse caso como incompatibilidade apesar do mesmo diâmetro.'
              },
              {
                id: 'fontes-avancado-q2',
                question: 'Qual é a diferença máxima de voltagem sugerida para substituição segura?',
                options: [
                  'Até 1,5V',
                  'Até 8V',
                  'Qualquer diferença é aceitável',
                  'Somente exatamente 0V'
                ],
                correctAnswer: 0,
                explanation: 'O material recomenda não ultrapassar 1,5V de diferença.'
              },
              {
                id: 'fontes-avancado-q3',
                question: 'Quando pode fazer sentido oferecer uma fonte de 90W no lugar de 65W?',
                options: [
                  'Em casos como bateria estendida ou aquecimento excessivo da fonte original',
                  'Sempre que o notebook for de 14 polegadas',
                  'Quando o cliente quer trocar a tela',
                  'Quando a fonte tem pino menor'
                ],
                correctAnswer: 0,
                explanation: 'A potência maior pode dar folga, mas a indicação depende do caso.'
              },
              {
                id: 'fontes-avancado-q4',
                question: 'Por que não se deve usar uma fonte USB-C de 29W em notebook que precisa de 65W?',
                options: [
                  'Porque a potência não atende à demanda do equipamento',
                  'Porque USB-C nunca carrega notebook',
                  'Porque 29W é sempre Magsafe',
                  'Porque o notebook passará a usar tela touch'
                ],
                correctAnswer: 0,
                explanation: 'Conector igual não garante potência suficiente.'
              },
              {
                id: 'fontes-avancado-q5',
                question: 'Qual conclusão correta sobre pino físico e compatibilidade?',
                options: [
                  'Pino igual é necessário, mas pode não ser suficiente',
                  'Pino igual elimina análise elétrica',
                  'Pino não importa em fontes',
                  'Pino só importa em baterias'
                ],
                correctAnswer: 0,
                explanation: 'Compatibilidade depende de encaixe, especificação elétrica e reconhecimento pelo notebook.'
              },
              {
                id: 'fontes-avancado-q6',
                question: 'Qual troca de voltagem abaixo tende a ser a mais arriscada pelo critério do treinamento?',
                options: [
                  '15V para 19V',
                  '18,5V para 19V',
                  '19V para 20V',
                  '20V para 19V'
                ],
                correctAnswer: 0,
                explanation: 'A diferença de 4V foge da margem sugerida e pode danificar o equipamento com o tempo.'
              },
              {
                id: 'fontes-avancado-q7',
                question: 'Por que uma fonte de 90W pode aquecer menos em notebook que consome 65W?',
                options: [
                  'Porque trabalha com folga de potência dentro da demanda do notebook',
                  'Porque muda a bateria para alta capacidade',
                  'Porque reduz automaticamente a voltagem para 5V',
                  'Porque dispensa o pino correto'
                ],
                correctAnswer: 0,
                explanation: 'A fonte de maior potência pode fornecer a demanda necessária com mais margem, desde que seja compatível.'
              },
              {
                id: 'fontes-avancado-q8',
                question: 'Qual é a orientação correta para casos Sony/Positivo com pinagens fora do padrão esperado?',
                options: [
                  'Validar o diâmetro e o modelo específico antes de indicar',
                  'Usar qualquer fonte antiga da Sony',
                  'Indicar sempre USB-C',
                  'Ignorar o histórico da marca'
                ],
                correctAnswer: 0,
                explanation: 'O material cita mudanças de padrão nessas marcas, então a validação precisa ser feita caso a caso.'
              }
            ]
          }
        }
      }
    ]
  };

