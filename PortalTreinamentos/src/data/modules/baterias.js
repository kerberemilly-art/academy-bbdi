export const bateriasModule = {
    id: 1,
    title: 'Baterias',
    description: 'Trilha completa para vender, identificar e diagnosticar baterias de notebook com segurança.',
    color: '#3b82f6',
    levels: [
      {
        id: 'basico',
        title: 'Básico',
        description: 'Fundamentos do produto, tipos de bateria, causas de desgaste e identificação correta.',
        lesson: {
          steps: [
            {
              title: 'Objetivo do nível básico',
              content: 'Destinado a novos colaboradores da equipe comercial e de atendimento.\n\nAo final deste nível, a pessoa deve entender o que é uma bateria de notebook, diferenciar bateria de fonte, reconhecer tipos de bateria e orientar o cliente na identificação do produto correto.\n\nEste nível prioriza segurança no atendimento: saber perguntar, saber explicar e evitar indicações erradas.',
            },
            {
              title: 'Diferença entre bateria e fonte',
              image: [
                '/images/bateria/Basico/baterias_básico_p2_i2.jpeg',
                '/images/fontes/fontes_básico_p1_i1.jpeg'
              ],
              content: 'Muitas vezes uma pessoa leiga pode acabar confundindo ou não sabendo bem a diferença entre uma bateria e uma fonte. Para que se possa entender vamos exemplificar do que se trata cada produto a partir das sua função.\n\nBATERIAS: Sua função é armazenar energia para o momento em que o notebook não estiver conectado mais a energia.\n\nFONTES: A função básica de uma fonte é fazer a conversão da energia de corrente alternada (110V / 240V) para a corrente contínua, a qual é a necessária ao equipamento (12V a 24V).',
            },
            {
              title: 'Identificando uma bateria de notebook',
              image: [
                '/images/bateria/Basico/baterias_básico_p3_i2.jpeg',
                '/images/bateria/Basico/baterias_básico_p3_i3.jpeg'
              ],
              content: 'Atualmente temos dois tipos de baterias disponíveis no mercado: as baterias internas e as baterias externas.\n\n1) Os modelos externos são os mais antigos e conhecidos pela facilidade da retirada da bateria, apenas puxando as travas que a seguram no compartimento.\n\n2) Já os modelos internos são modelos onde na grande maioria dos casos é necessário a retirada da tampa traseira do equipamento para poder acessar a bateria.',
            },
            {
              title: 'Células Li-Ion x Li-Po',
              image: [
                '/images/bateria/Basico/baterias_básico_p4_i1.jpeg',
                '/images/bateria/Basico/baterias_básico_p4_i3.jpeg'
              ],
              content: 'Apesar de ambos os modelos terem o mesmo elemento interno (Li-ion), a diferença está na forma como este elemento é armazenado.\n\nModelos Externos: São armazenados em células cilíndricas (parecendo pilhas).\n\nModelos Internos: São em "bags" ou bolsas plásticas mais maleáveis e finas (Li-Po).',
            },
            {
              title: 'Características de uma bateria',
              image: '/images/bateria/Basico/baterias_básico_p5_i1.jpeg',
              content: '1) Voltagem: A tensão da bateria está ligada à quantidade de células, variando entre 7.4V e 15.2V.\n\n2) Amperagem: É a capacidade de carga total. Quanto maior for esta unidade, maior será a autonomia do produto.\n\n3) Watts: É a potência total da bateria (Wh - watts/hora).\n\n4) Part Number: É o código que identifica a bateria. Por ele é possível identificar o formato, encaixe e compatibilidade.',
            },
            {
              title: 'Fórmula de Capacidade (Wh)',
              image: '/images/bateria/Basico/baterias_básico_p12_i3.jpeg',
              content: 'Esta é a fórmula base para descobrir as informações de uma bateria. \n\nExemplo: Se uma bateria possui 6600mAh e 10.8 Volts, basta multiplicar ambos os valores obtendo assim 72Wh (arredondamos os valores).',
            },
            {
              title: 'Identificação pelo Modelo (Software)',
              image: [
                '/images/bateria/Basico/baterias_básico_p7_i2.jpeg',
                '/images/bateria/Basico/baterias_básico_p7_i3.png'
              ],
              content: 'Através do sistema operacional (Windows):\n\n1) Segure a tecla Windows + R para abrir o menu "Executar".\n2) Digite "dxdiag" para abrir a Ferramenta de Diagnósticos.\n\nNesta tela estará disponível a informação sobre o modelo do seu notebook.',
            },
            {
              title: 'Identificação pelo Notebook (Etiqueta)',
              image: '/images/bateria/Basico/baterias_básico_p8_i2.jpeg',
              content: 'Uma das maneiras mais fáceis é procurar no próprio aparelho. A maioria dos notebooks possui etiquetas na parte de baixo com informações sobre o modelo, número serial e mais.\n\nCom essa informação, pode-se fazer uma pesquisa em nosso site ou CRM para identificar a bateria correta.',
            },
            {
              title: 'Pesquisa no Site e Callcenter',
              image: '/images/bateria/Basico/baterias_básico_p9_i2.jpeg',
              content: 'No site (BB Baterias): Pode-se colocar o modelo direto no campo de pesquisa ou usar o menu de marcas/linhas.\n\nNo Callcenter (Protheus): Pesquise pela aba callcenter e o sistema retornará todos os produtos compatíveis com o modelo pesquisado.',
            },
          ],
          quiz: {
            title: 'Quiz: Baterias - Nível Básico',
            questions: [
              {
                id: 'basico-q1',
                question: 'Qual é a função principal da bateria de notebook?',
                options: [
                  'Converter energia da tomada para a tensão do notebook',
                  'Armazenar energia e alimentar o notebook fora da tomada',
                  'Aumentar a velocidade do processador',
                  'Controlar a imagem exibida na tela'
                ],
                correctAnswer: 1,
                explanation: 'A fonte converte energia da tomada. A bateria armazena energia e mantém o notebook funcionando quando ele está desconectado.'
              },
              {
                id: 'basico-q2',
                question: 'Qual componente regula a carga e protege a bateria contra sobrecarga?',
                options: [
                  'BMS',
                  'HDMI',
                  'Chipset de vídeo',
                  'Teclado'
                ],
                correctAnswer: 0,
                explanation: 'A BMS é a placa gerenciadora da bateria. Ela regula carga, descarga e proteções elétricas.'
              },
              {
                id: 'basico-q3',
                question: 'Qual afirmação descreve corretamente uma bateria interna?',
                options: [
                  'É sempre removida por travas externas',
                  'Costuma exigir abertura do equipamento e usa células em bolsa',
                  'Só existe em notebooks antigos',
                  'Não possui células de lítio'
                ],
                correctAnswer: 1,
                explanation: 'Baterias internas ficam dentro do equipamento, geralmente em notebooks modernos, e costumam usar células Li-Po em bolsa.'
              },
              {
                id: 'basico-q4',
                question: 'O que deve ser informado ao cliente sobre baterias externas de alta capacidade?',
                options: [
                  'Elas sempre têm o mesmo tamanho da bateria original',
                  'Elas podem desnivelar o notebook ou impedir o fechamento da tela',
                  'Elas não aumentam a autonomia',
                  'Elas dispensam o uso de fonte'
                ],
                correctAnswer: 1,
                explanation: 'A alta capacidade pode exigir mais células e alterar o volume físico da bateria. Isso precisa ser explicado antes da venda.'
              },
              {
                id: 'basico-q5',
                question: 'Qual é o critério mais confiável para identificar a bateria correta?',
                options: [
                  'Cor do notebook',
                  'Tamanho da tela',
                  'Part Number impresso na bateria original',
                  'Quantidade de portas USB'
                ],
                correctAnswer: 2,
                explanation: 'O Part Number identifica a peça com maior precisão, principalmente quando o mesmo notebook pode usar baterias diferentes.'
              },
              {
                id: 'basico-q6',
                question: 'Um cliente diz que o notebook não liga fora da tomada, mas funciona conectado. Qual suspeita faz mais sentido no primeiro atendimento?',
                options: [
                  'Problema de tela',
                  'Falha relacionada à bateria ou ao carregamento dela',
                  'Memória RAM incompatível',
                  'Teclado com defeito'
                ],
                correctAnswer: 1,
                explanation: 'Se o equipamento funciona conectado e falha fora da tomada, a investigação inicial deve focar bateria, carga e fonte.'
              },
              {
                id: 'basico-q7',
                question: 'Qual situação aumenta o risco de descarga profunda irreversível?',
                options: [
                  'Guardar a bateria por muito tempo sem carga',
                  'Usar o notebook em uma mesa plana',
                  'Consultar o modelo pelo dxdiag',
                  'Usar uma bateria com Part Number correto'
                ],
                correctAnswer: 0,
                explanation: 'Baterias paradas por muito tempo sem carga podem entrar em descarga profunda e não recuperar funcionamento normal.'
              },
              {
                id: 'basico-q8',
                question: 'Quando o cliente não sabe o Part Number, qual caminho ajuda a iniciar a busca?',
                options: [
                  'Perguntar apenas a cor do notebook',
                  'Identificar o modelo pelo dxdiag ou pela etiqueta física do notebook',
                  'Pesquisar pelo tamanho do carregador',
                  'Selecionar qualquer bateria da mesma marca'
                ],
                correctAnswer: 1,
                explanation: 'O modelo do notebook ajuda a iniciar a consulta, embora o Part Number continue sendo o critério mais preciso quando disponível.'
              },
              {
                id: 'basico-q9',
                question: 'Qual diferença prática entre Li-Ion e Li-Po é relevante para o atendimento?',
                options: [
                  'Li-Ion costuma usar células cilíndricas; Li-Po usa células em bolsa',
                  'Li-Po só existe em fontes',
                  'Li-Ion não armazena energia',
                  'Não existe diferença física entre elas'
                ],
                correctAnswer: 0,
                explanation: 'Essa diferença ajuda a explicar por que baterias externas e internas têm formatos e cuidados diferentes.'
              }
            ]
          }
        }
      },
      {
        id: 'intermediario',
        title: 'Intermediário',
        description: 'Part Number, ligações de células, variações elétricas e capacidades estendidas.',
        lesson: {
          steps: [
            {
              title: 'O Part Number da bateria',
              image: '/images/bateria/Intermediario/baterias_intermediário_p2_i1.jpeg',
              content: 'Nenhuma bateria é produzida pelo fabricante do notebook (Acer, Dell, HP). Elas são feitas por fornecedores que disponibilizam uma referência: o Part Number.\n\nPelo Part Number sempre é possível identificar com certeza se a bateria será compatível. Geralmente esta informação consta na parte interna, exigindo a retirada da bateria.',
            },
            {
              title: 'Ligações em Série e Paralelo',
              image: '/images/bateria/Intermediario/baterias_intermediário_p4_i1.jpeg',
              content: 'Série (Positivo com Negativo): Soma-se as voltagens e mantém-se a amperagem. Ex: 3.7V + 3.7V + 3.7V = 11.1V.\n\nParalelo (Positivo com Positivo): Soma-se as amperagens e mantém-se as voltagens. Ex: 2200mAh + 2200mAh = 4400mAh.\n\nBaterias de 6 células usam ligações serial + paralela para somar tanto voltagem quanto amperagem.',
            },
            {
              title: 'Diferença de 10.8V e 11.1V',
              content: 'Uma célula pode constar 3.6V ou 3.7V. Por isso, existem variações normais no mercado:\n\n- 10.8V ou 11.1V\n- 14.4V ou 14.8V\n\nEsta regra serve tanto para baterias internas quanto externas.',
            },
            {
              title: 'Baterias de Capacidade Estendida',
              image: [
                '/images/bateria/Intermediario/baterias_intermediário_p5_i1.jpeg',
                '/images/bateria/Intermediario/baterias_intermediário_p6_i2.jpeg'
              ],
              content: 'É possível substituir a bateria por um modelo com maior autonomia (mais células). \n\nExternas: O número superior de células deixa uma saliência para fora, mas não atrapalha a compatibilidade.\n\nInternas: É necessário ver se o notebook comporta o espaço extra. No Dell Latitude E5250, por exemplo, o HD pode impedir o uso de baterias maiores.',
            },
            {
              title: 'Sistema Pai e Filho',
              image: '/images/bateria/Intermediario/baterias_intermediário_p7_i2.jpeg',
              content: 'Produtos com variações de cor ou voltagem que NÃO influenciam na compatibilidade são organizados como Pais e Filhos. \n\nNo Protheus, eles aparecem como referências separadas, mas no site as informações são replicadas do Pai para o Filho para facilitar a navegação.',
            },
          ],
          quiz: {
            title: 'Quiz: Baterias - Nível Intermediário',
            questions: [
              {
                id: 'intermediario-q1',
                question: 'O que acontece na ligação em série (Positivo com Negativo)?',
                options: [
                  'Soma-se as voltagens e mantém-se a amperagem',
                  'Soma-se as amperagens e mantém-se a voltagem',
                  'Diminui a voltagem pela metade',
                  'A bateria deixa de funcionar'
                ],
                correctAnswer: 0,
                explanation: 'Na ligação em série, as tensões das células se somam, enquanto a capacidade (amperagem) permanece a mesma de uma única célula.'
              },
              {
                id: 'intermediario-q2',
                question: 'Qual a principal diferença visual de uma bateria externa de alta capacidade?',
                options: [
                  'Ela é menor que a original',
                  'Ela possui uma saliência para fora do equipamento',
                  'Ela é sempre de cor branca',
                  'Ela não possui Part Number'
                ],
                correctAnswer: 1,
                explanation: 'Baterias externas de alta capacidade possuem mais células, o que geralmente cria uma saliência física no formato da bateria.'
              }
            ]
          }
        }
      },
      {
        id: 'avancado',
        title: 'Avançado',
        description: 'Análise de concorrência, estimativa de duração, chipsets e histórico ACPI.',
        lesson: {
          steps: [
            {
              title: 'Análise de Compatibilidade (BringIt)',
              image: [
                '/images/bateria/Avançado/baterias_avançado_p2_i3.png',
                '/images/bateria/Avançado/baterias_avançado_p3_i2.png'
              ],
              content: 'Podemos identificar modelos equivalentes usando o SKU da concorrência (BringIt).\n\nPasso 1: Identifique o SKU no site deles (ex: BC316).\nPasso 2: Use o Tableau BBDI ou a planilha de códigos com CTRL+F para localizar nossa referência BBDI correspondente.',
            },
            {
              title: 'Estimativa de Duração',
              image: '/images/bateria/Avançado/baterias_avançado_p6_i2.jpeg',
              content: 'A duração depende do consumo (tela, apps, etc), mas seguimos esta estimativa baseada em mAh:\n\n- 2200 mAh: ~ 1h a 1h30\n- 4400 mAh: ~ 2h a 2h30\n- 6600 mAh: ~ 3h a 3h30\n- 8800 mAh: ~ 4h a 4h30',
            },
            {
              title: 'Diferenças de Amperagem (mAh)',
              image: [
                '/images/bateria/Avançado/baterias_avançado_p8_i2.jpeg',
                '/images/bateria/Avançado/baterias_avançado_p9_i2.jpeg'
              ],
              content: 'Se o nosso modelo tem 5200mAh e o do cliente 4400mAh, ele terá 20% a 30% mais autonomia. \n\nCaso o contrário (cliente tem 5200mAh e o nosso é 4400mAh), informe que a autonomia será 15% a 20% inferior. O cliente geralmente aceita ao ser informado com transparência.',
            },
            {
              title: 'Incompatibilidade por Chipset',
              image: '/images/bateria/Avançado/baterias_avançado_p13_i2.jpeg',
              content: 'Baterias têm um chipset que conversa com o notebook. Quando uma linha nova é lançada, o chipset pode ser atualizado. \n\nMesmo que sejam fisicamente iguais, uma bateria antiga pode não ser reconhecida. Na dúvida, sempre venda o modelo mais atual da linha.',
            },
            {
              title: 'Limpando o Histórico ACPI',
              image: [
                '/images/bateria/Avançado/baterias_avançado_p14_i2.jpeg',
                '/images/bateria/Avançado/baterias_avançado_p15_i2.jpeg'
              ],
              content: 'Se o notebook não reconhecer a bateria nova, exclua o histórico:\n\n1) Ligue o note apenas na fonte (sem bateria).\n2) Vá em Gerenciador de Dispositivos -> Baterias.\n3) Desinstale "Bateria Método de controle Compatível com ACPI da Microsoft".\n4) Recoloque a bateria nova.',
            },
            {
              title: 'Battery Life Extender (70% de carga)',
              content: 'Se a bateria para de carregar em 70% ou 80%, pode ser o recurso Battery Life Extender ativado no notebook. \n\nEle limita a carga para evitar altas temperaturas e aumentar a vida útil das células. É uma configuração do sistema, não um defeito da bateria.',
            },
          ],
          quiz: {
            title: 'Quiz: Baterias - Nível Avançado',
            questions: [
              {
                id: 'avancado-q1',
                question: 'O que deve ser feito se a bateria nova não for reconhecida devido ao histórico do sistema?',
                options: [
                  'Trocar o teclado',
                  'Desinstalar o driver ACPI no Gerenciador de Dispositivos',
                  'Formatar o HD',
                  'Aumentar o brilho da tela'
                ],
                correctAnswer: 1,
                explanation: 'Desinstalar o driver ACPI limpa o cache do sistema operacional sobre a bateria antiga, permitindo o reconhecimento da nova.'
              }
            ]
          }
        }
      }
    ]
  };
