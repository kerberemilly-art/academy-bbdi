export const memoriasModule = {
    id: 5,
    title: 'Memórias',
    icon: 'Cpu',
    color: '#ef4444',
    description: 'Trilha para orientar compatibilidade e upgrade de memória RAM por família, tensão, frequência e capacidade.',
    levels: [
      {
        id: 'basico',
        title: 'Básico',
        description: 'Função da RAM, diferença para armazenamento e famílias DDR.',
        lesson: {
          steps: [
            {
              title: 'Função da memória RAM',
              content: 'A memória RAM influencia diretamente na velocidade do notebook e na capacidade de manter programas em execução.\n\nDiferente de HD ou SSD, a RAM não armazena arquivos de forma permanente. Ela executa dados temporários para que o sistema e os programas funcionem com mais agilidade.',
              image: '/images/memória/memoria_ram_p6_i3.jpeg',
              imagePlacement: 'afterContent',
            },
            {
              title: 'Famílias de memória',
              content: 'As memórias são divididas em famílias, como DDR2, DDR3, DDR3L, DDR4 e DDR5.\n\nCada família possui características próprias, principalmente tensão e posição do encaixe.\n\nDDR2 é mais antiga e trabalha com 1,8V. DDR3 trabalha com 1,5V. DDR4 trabalha com 1,2V.\n\nDDR5 é mais moderna e melhora bastante o desempenho, mas o material indica que não será trabalhada no momento.',
              image: '/images/memória/memoria_ram_p2_i2.jpeg',
              imagePlacement: 'afterContent',
            },
            {
              title: 'Compatibilidade básica',
              content: 'A família da memória é o principal critério de compatibilidade.\n\nMemórias de famílias diferentes não devem ser misturadas, pois possuem tensões e encaixes diferentes.\n\nIdentificar corretamente a família evita grande parte dos erros de venda.',
              image: '/images/memória/memoria_ram_p4_i2.jpeg',
              imagePlacement: 'afterContent',
            },
          ],
          quiz: {
            title: 'Quiz: Memórias - Nível Básico',
            questions: [
              {
                id: 'memorias-basico-q1',
                question: 'Qual é a função principal da memória RAM?',
                options: [
                  'Executar dados temporários e melhorar desempenho',
                  'Armazenar arquivos permanentemente',
                  'Carregar a bateria',
                  'Converter energia da tomada'
                ],
                correctAnswer: 0,
                explanation: 'RAM ajuda o sistema a executar programas, mas não substitui HD ou SSD para armazenamento permanente.'
              },
              {
                id: 'memorias-basico-q2',
                question: 'Qual é o principal critério de compatibilidade da RAM?',
                options: [
                  'Família da memória',
                  'Cor da etiqueta',
                  'Tamanho da tela',
                  'Layout do teclado'
                ],
                correctAnswer: 0,
                explanation: 'DDR3, DDR4 e outras famílias têm tensão e encaixe próprios.'
              },
              {
                id: 'memorias-basico-q3',
                question: 'Qual família trabalha com 1,2V no material?',
                options: [
                  'DDR4',
                  'DDR2',
                  'CCFL',
                  'SATA III'
                ],
                correctAnswer: 0,
                explanation: 'O material cita DDR4 com tensão de 1,2V.'
              },
              {
                id: 'memorias-basico-q4',
                question: 'Memória RAM é equivalente a HD ou SSD?',
                options: [
                  'Não, RAM executa dados temporários; HD/SSD armazenam arquivos',
                  'Sim, todos armazenam dados da mesma forma',
                  'Sim, RAM guarda arquivos sem energia',
                  'Não existe diferença prática'
                ],
                correctAnswer: 0,
                explanation: 'RAM é memória de trabalho; HD e SSD são armazenamento.'
              },
              {
                id: 'memorias-basico-q5',
                question: 'Qual família é citada como mais antiga e não trabalhada no momento?',
                options: [
                  'DDR2',
                  'DDR4',
                  'DDR5',
                  'NVMe'
                ],
                correctAnswer: 0,
                explanation: 'DDR2 aparece no material como modelo antigo, importante de conhecer, mas não trabalhado.'
              },
              {
                id: 'memorias-basico-q6',
                question: 'Por que famílias diferentes de RAM não devem ser misturadas?',
                options: [
                  'Porque possuem tensão e encaixe diferentes',
                  'Porque mudam o tamanho da tela',
                  'Porque alteram o pino da fonte',
                  'Porque desligam o teclado numérico'
                ],
                correctAnswer: 0,
                explanation: 'A família define características físicas e elétricas essenciais para compatibilidade.'
              },
              {
                id: 'memorias-basico-q7',
                question: 'Qual família é citada como mais moderna, mas fora do escopo de trabalho no momento?',
                options: [
                  'DDR5',
                  'DDR2',
                  'CCFL',
                  'SATA III'
                ],
                correctAnswer: 0,
                explanation: 'DDR5 é citada como moderna e de melhor desempenho, mas não trabalhada no momento do material.'
              },
              {
                id: 'memorias-basico-q8',
                question: 'Qual informação física ajuda a diferenciar famílias de memória?',
                options: [
                  'Posição da área de encaixe',
                  'Formato do Enter',
                  'Diâmetro do pino da fonte',
                  'Quantidade de brackets da tela'
                ],
                correctAnswer: 0,
                explanation: 'Além da tensão, a posição do encaixe ajuda a diferenciar as famílias de RAM.'
              }
            ]
          }
        }
      },
      {
        id: 'intermediario',
        title: 'Intermediário',
        description: 'DDR3L, frequência, upgrade e padrões comuns de capacidade.',
        lesson: {
          steps: [
            {
              title: 'Caso especial DDR3L',
              content: 'DDR3L significa Low Voltage e trabalha com 1,35V.\n\nDDR3L funciona em dispositivos compatíveis com DDR3L e também em dispositivos que usam DDR3 convencional.\n\nO inverso não é seguro: memória DDR3 convencional não funciona em dispositivos que exigem DDR3L.\n\nEsse é o principal caso de substituição entre variações próximas de família.',
              image: '/images/memória/memoria_ram_p4_i3.jpeg',
              imagePlacement: 'afterContent',
            },
            {
              title: 'Frequência e upgrade',
              content: 'A frequência é medida em MHz.\n\nA frequência não costuma causar incompatibilidade quando a família está correta.\n\nEm upgrade com duas memórias de frequências diferentes, o conjunto trabalha na frequência mais baixa entre elas.\n\nExemplo: se uma memória é mais rápida e a outra mais lenta, ambas tendem a operar na velocidade da mais lenta.',
              image: '/images/memória/memoria_ram_p7_i2.jpeg',
              imagePlacement: 'afterContent',
            },
            {
              title: 'Padrões comuns',
              content: 'Padrões comuns citados no material:\n\nDDR2: 1GB ou 2GB, com frequências como 667MHz ou 800MHz, mas não trabalhada.\n\nDDR3: 2GB ou 4GB, com 1067MHz, 1333MHz ou 1600MHz.\n\nDDR4: 4GB, 8GB ou 16GB, com 2133MHz ou 2400MHz.\n\nEsses valores ajudam no atendimento, mas a compatibilidade final deve considerar o notebook.',
            },
          ],
          quiz: {
            title: 'Quiz: Memórias - Nível Intermediário',
            questions: [
              {
                id: 'memorias-intermediario-q1',
                question: 'O que significa o L em DDR3L?',
                options: [
                  'Low Voltage',
                  'Large Display',
                  'Light Keyboard',
                  'Long Cable'
                ],
                correctAnswer: 0,
                explanation: 'DDR3L é uma variação de baixa tensão.'
              },
              {
                id: 'memorias-intermediario-q2',
                question: 'Uma DDR3 convencional funciona em notebook que exige DDR3L?',
                options: [
                  'Não',
                  'Sim, sempre',
                  'Somente se a tela for Full HD',
                  'Somente com fonte de 90W'
                ],
                correctAnswer: 0,
                explanation: 'O material alerta que DDR3 não substitui DDR3L quando o equipamento exige baixa tensão.'
              },
              {
                id: 'memorias-intermediario-q3',
                question: 'Se duas memórias têm frequências diferentes, o que tende a ocorrer?',
                options: [
                  'Ambas trabalham na frequência mais baixa',
                  'O notebook soma as frequências',
                  'A memória vira DDR4',
                  'O SSD fica mais lento'
                ],
                correctAnswer: 0,
                explanation: 'Em conjunto, a memória mais rápida se ajusta à frequência mais baixa.'
              },
              {
                id: 'memorias-intermediario-q4',
                question: 'A frequência, sozinha, costuma causar incompatibilidade quando a família está correta?',
                options: [
                  'Não',
                  'Sim, sempre',
                  'Somente em teclados',
                  'Somente em telas CCFL'
                ],
                correctAnswer: 0,
                explanation: 'A família é o fator principal; frequência afeta desempenho, não costuma impedir funcionamento.'
              },
              {
                id: 'memorias-intermediario-q5',
                question: 'Quais capacidades comuns são citadas para DDR4?',
                options: [
                  '4GB, 8GB ou 16GB',
                  '100W, 120W ou 150W',
                  '14,0, 15,6 ou 17,3 polegadas',
                  '30, 40 ou 50 pinos'
                ],
                correctAnswer: 0,
                explanation: 'O material lista 4GB, 8GB e 16GB como capacidades comuns para DDR4.'
              },
              {
                id: 'memorias-intermediario-q6',
                question: 'Qual tensão é associada à DDR3L?',
                options: [
                  '1,35V',
                  '1,8V',
                  '12V',
                  '19V'
                ],
                correctAnswer: 0,
                explanation: 'DDR3L é a versão Low Voltage e trabalha com 1,35V.'
              },
              {
                id: 'memorias-intermediario-q7',
                question: 'Se um notebook usa DDR3 convencional, uma DDR3L pode funcionar nele?',
                options: [
                  'Sim, o material indica compatibilidade nesse sentido',
                  'Não, DDR3L só funciona em DDR4',
                  'Não, DDR3L é SSD',
                  'Sim, mas apenas com tela Full HD'
                ],
                correctAnswer: 0,
                explanation: 'O caso especial citado é DDR3L funcionando em equipamentos DDR3L e DDR3 convencional.'
              },
              {
                id: 'memorias-intermediario-q8',
                question: 'Qual frequência aparece como comum em DDR4 no material?',
                options: [
                  '2400MHz',
                  '60Hz',
                  '500MB/s',
                  '65W'
                ],
                correctAnswer: 0,
                explanation: 'O material cita 2133MHz e 2400MHz como frequências comuns de DDR4.'
              }
            ]
          }
        }
      },
      {
        id: 'avancado',
        title: 'Avançado',
        description: 'Consulta de compatibilidade, decisão de upgrade e orientação ao cliente.',
        lesson: {
          steps: [
            {
              title: 'Consulta pelo modelo do notebook',
              content: 'Depois de identificar o modelo do notebook, consulte bases de compatibilidade para confirmar família, frequência e capacidade suportada.\n\nSe a base indicada não retornar resultado, pesquise diretamente pelo modelo do notebook em fontes confiáveis.\n\nA consulta deve confirmar a família compatível antes de qualquer oferta.',
              image: '/images/memória/memoria_ram_p9_i2.jpeg',
              imagePlacement: 'afterContent',
            },
            {
              title: 'Upgrade com uma ou duas memórias',
              content: 'O upgrade pode ser feito adicionando uma memória extra ou substituindo a original.\n\nAntes de indicar, verifique se o notebook tem slot disponível, qual família aceita e qual capacidade máxima suporta.\n\nNão basta saber que o cliente quer mais desempenho; a placa precisa aceitar a configuração.',
              image: '/images/memória/memoria_ram_p6_i3.jpeg',
              imagePlacement: 'afterContent',
            },
            {
              title: 'Resumo de decisão',
              content: 'Checklist de venda: modelo do notebook, família da memória, capacidade desejada, frequência, quantidade de slots e limite máximo suportado.\n\nSe a família for compatível, a frequência diferente tende a se ajustar. Se a família estiver errada, a memória não deve ser indicada.\n\nMemória é uma venda de compatibilidade técnica, não apenas de capacidade.',
            },
          ],
          quiz: {
            title: 'Quiz: Memórias - Nível Avançado',
            questions: [
              {
                id: 'memorias-avancado-q1',
                question: 'Qual é o primeiro dado usado na consulta de compatibilidade de memória?',
                options: [
                  'Modelo do notebook',
                  'Cor do teclado',
                  'Marca da fonte',
                  'Tipo de backlight da tela'
                ],
                correctAnswer: 0,
                explanation: 'O material orienta começar pelo modelo do notebook antes de consultar a memória compatível.'
              },
              {
                id: 'memorias-avancado-q2',
                question: 'Se a base indicada não retornar resultado, o que fazer?',
                options: [
                  'Pesquisar diretamente pelo modelo do notebook em fontes confiáveis',
                  'Vender qualquer DDR4',
                  'Ignorar o modelo',
                  'Trocar por SSD SATA'
                ],
                correctAnswer: 0,
                explanation: 'O material orienta usar o modelo do notebook como referência de busca quando a base não trouxer o resultado.'
              },
              {
                id: 'memorias-avancado-q3',
                question: 'O que o site de consulta mostra sobre a memória compatível?',
                options: [
                  'Família e frequência',
                  'Somente a cor da placa',
                  'A potência da fonte',
                  'O layout do teclado'
                ],
                correctAnswer: 0,
                explanation: 'A tela de consulta destaca a família e a frequência compatíveis da memória.'
              },
              {
                id: 'memorias-avancado-q4',
                question: 'Qual é a orientação do material depois de saber o modelo do notebook?',
                options: [
                  'Usar o link/site de consulta para verificar a compatibilidade',
                  'Escolher a maior frequência possível sem consulta',
                  'Ignorar a família da memória',
                  'Trocar por DDR2'
                ],
                correctAnswer: 0,
                explanation: 'O material destaca o uso do link de consulta para confirmar a memória correta.'
              },
              {
                id: 'memorias-avancado-q5',
                question: 'Qual frase resume melhor a venda de memória RAM?',
                options: [
                  'É venda de compatibilidade técnica, não apenas de capacidade',
                  'É só escolher o maior GB disponível',
                  'Qualquer DDR serve em qualquer notebook',
                  'Frequência é o único fator relevante'
                ],
                correctAnswer: 0,
                explanation: 'Capacidade maior só faz sentido quando família e notebook são compatíveis.'
              },
              {
                id: 'memorias-avancado-q6',
                question: 'O upgrade de memória pode ser feito de quais formas?',
                options: [
                  'Adicionando uma memória extra ou substituindo a original',
                  'Trocando a tela por Full HD',
                  'Mudando o layout do teclado',
                  'Aumentando a voltagem da fonte'
                ],
                correctAnswer: 0,
                explanation: 'O material cita as duas formas de upgrade: inserir uma memória ou trocar a original.'
              },
              {
                id: 'memorias-avancado-q7',
                question: 'Qual informação deve ser confirmada antes de ofertar uma memória?',
                options: [
                  'Família compatível com o notebook',
                  'Cor do teclado',
                  'Marca da fonte',
                  'Tipo de backlight da tela'
                ],
                correctAnswer: 0,
                explanation: 'A família define encaixe e tensão, sendo o filtro mais importante.'
              },
              {
                id: 'memorias-avancado-q8',
                question: 'Qual risco existe ao indicar memória apenas pela frequência?',
                options: [
                  'Errar a família e vender uma peça incompatível',
                  'Aumentar automaticamente a autonomia da bateria',
                  'Alterar o pino da fonte',
                  'Transformar HD em SSD'
                ],
                correctAnswer: 0,
                explanation: 'Frequência é secundária; família errada impede a compatibilidade.'
              }
            ]
          }
        }
      }
    ]
  };

