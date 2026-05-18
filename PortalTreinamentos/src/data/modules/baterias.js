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
                '/images/bateria/Basico/baterias_básico_p2_i3.jpeg'
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
              image: '/images/bateria/slides/baterias_basico_p6.png',
              content: 'Esta é a fórmula base para descobrir as informações de uma bateria. \n\nExemplo: Se uma bateria possui 6600mAh e 10.8 Volts, basta multiplicar ambos os valores obtendo assim 72Wh (arredondamos os valores).',
            },
            {
              title: 'Identificação pelo Modelo (Software)',
              image: [
                '/images/bateria/Basico/baterias_básico_p7_i2.jpeg',
                '/images/bateria/Basico/baterias_básico_p7_i3.png',
                '/images/bateria/Basico/baterias_básico_p7_i4.png'
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
            {
              title: 'Número de células em baterias externas',
              image: [
                '/images/bateria/Basico/baterias_básico_p10_i1.jpeg',
                '/images/bateria/Basico/baterias_básico_p10_i3.jpeg',
                '/images/bateria/Basico/baterias_básico_p10_i4.jpeg'
              ],
              content: 'Em baterias externas, o número de células pode ser identificado pela voltagem, amperagem e pelo formato físico.\n\nModelos de 6 células normalmente possuem cerca de 4400mAh. Modelos de 12 células podem chegar a cerca de 8800mAh e criam uma elevação visível quando encaixados no notebook.',
            },
            {
              title: 'Número de células em baterias internas',
              image: [
                '/images/bateria/Basico/baterias_básico_p11_i1.jpeg',
                '/images/bateria/Basico/baterias_básico_p11_i2.jpeg'
              ],
              content: 'Baterias internas ficam dentro do equipamento e têm espaço limitado. Por isso, geralmente trabalham com 2, 3 ou 4 células.\n\nMesmo quando duas baterias parecem compatíveis, é importante confirmar se o notebook comporta o número de células e o espaço físico da peça.',
            },
            {
              title: 'Cuidado com células extras em baterias internas',
              image: [
                '/images/bateria/Basico/baterias_básico_p12_i2.jpeg',
                '/images/bateria/Basico/baterias_básico_p12_i4.jpeg'
              ],
              content: 'Em alguns casos, o encaixe da bateria é idêntico, mas uma versão possui uma célula a mais.\n\nA bateria pode ser compatível eletricamente, mas a célula extra pode ocupar um espaço que o notebook não tem. Antes da indicação, valide o formato físico e o espaço interno do equipamento.',
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
              title: 'Principais padrões de Part Number',
              image: '/images/bateria/Intermediario/baterias_intermediário_p3_i2.png',
              content: 'Cada fabricante costuma usar padrões próprios de Part Number. Esses padrões não cobrem todos os casos, mas ajudam a reconhecer referências de marcas como Acer, HP, Dell, Lenovo, Samsung e Sony.\n\nUse esses padrões como apoio inicial. A validação final deve cruzar Part Number, modelo do notebook e características físicas da bateria.',
            },
            {
              title: 'Ligações em Série e Paralelo',
              image: [
                '/images/bateria/Intermediario/baterias_intermediário_p4_i1.jpeg',
                '/images/bateria/Intermediario/baterias_intermediário_p5_i1.jpeg',
                '/images/bateria/Intermediario/baterias_intermediário_p6_i2.jpeg'
              ],
              content: 'Série (Positivo com Negativo): Soma-se as voltagens e mantém-se a amperagem. Ex: 3.7V + 3.7V + 3.7V = 11.1V.\n\nParalelo (Positivo com Positivo): Soma-se as amperagens e mantém-se as voltagens. Ex: 2200mAh + 2200mAh = 4400mAh.\n\nBaterias de 6 células usam ligações serial + paralela para somar tanto voltagem quanto amperagem.',
            },
            {
              title: 'Diferença de 10.8V e 11.1V',
              image: [
                '/images/bateria/Intermediario/baterias_intermediário_p7_i2.jpeg',
                '/images/bateria/Intermediario/baterias_intermediário_p7_i3.jpeg'
              ],
              content: 'Uma célula pode constar 3.6V ou 3.7V. Por isso, existem variações normais no mercado:\n\n- 10.8V ou 11.1V\n- 14.4V ou 14.8V\n\nEsta regra serve tanto para baterias internas quanto externas.',
            },
            {
              title: 'Baterias de Capacidade Estendida',
              image: [
                '/images/bateria/Intermediario/baterias_intermediário_p8_i2.jpeg',
                '/images/bateria/Intermediario/baterias_intermediário_p8_i3.jpeg',
                '/images/bateria/Intermediario/baterias_intermediário_p8_i4.jpeg',
                '/images/bateria/Intermediario/baterias_intermediário_p9_i2.jpeg'
              ],
              content: 'É possível substituir a bateria por um modelo com maior autonomia (mais células). \n\nExternas: O número superior de células deixa uma saliência para fora, mas não atrapalha a compatibilidade.\n\nInternas: É necessário ver se o notebook comporta o espaço extra. No Dell Latitude E5250, por exemplo, o HD pode impedir o uso de baterias maiores.',
            },
            {
              title: 'Sistema Pai e Filho',
              image: [
                '/images/bateria/Intermediario/baterias_intermediário_p10_i2.jpeg',
                '/images/bateria/Intermediario/baterias_intermediário_p11_i2.png'
              ],
              content: 'Produtos com variações de cor, voltagem, células e outras características que NÃO influenciam na compatibilidade são organizados como Pais e Filhos.\n\nNo site, as informações são cadastradas no produto Pai e replicadas para os Filhos. No Protheus, as variações podem aparecer como referências separadas, então é necessário conferir se elas pertencem à mesma família compatível.',
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
              },
              {
                id: 'intermediario-q3',
                question: 'Por que o Part Number é uma informação importante na identificação da bateria?',
                options: [
                  'Porque indica apenas a cor da bateria',
                  'Porque ajuda a confirmar compatibilidade, formato e aplicação correta',
                  'Porque substitui a necessidade de conferir o modelo do notebook em todos os casos',
                  'Porque informa o tamanho da tela do notebook'
                ],
                correctAnswer: 1,
                explanation: 'O Part Number é uma das referências mais seguras para confirmar se a bateria pertence à aplicação correta.'
              },
              {
                id: 'intermediario-q4',
                question: 'O que acontece na ligação em paralelo (Positivo com Positivo)?',
                options: [
                  'Soma-se a amperagem e mantém-se a voltagem',
                  'Soma-se a voltagem e mantém-se a amperagem',
                  'A bateria perde o Part Number',
                  'A voltagem vira sempre 7.4V'
                ],
                correctAnswer: 0,
                explanation: 'Na ligação em paralelo, a capacidade em mAh aumenta, enquanto a tensão do conjunto é mantida.'
              },
              {
                id: 'intermediario-q5',
                question: 'Por que existem baterias equivalentes com 10.8V e 11.1V?',
                options: [
                  'Porque algumas células são indicadas como 3.6V e outras como 3.7V',
                  'Porque uma é de teclado e outra é de tela',
                  'Porque 10.8V sempre significa bateria com defeito',
                  'Porque 11.1V só funciona em fontes'
                ],
                correctAnswer: 0,
                explanation: 'A diferença vem da nomenclatura usada para a tensão das células. Três células de 3.6V resultam em 10.8V; três de 3.7V resultam em 11.1V.'
              },
              {
                id: 'intermediario-q6',
                question: 'Qual cuidado é necessário ao indicar bateria interna de capacidade estendida?',
                options: [
                  'Confirmar se há espaço físico interno para a bateria maior',
                  'Ignorar o formato físico, pois toda bateria interna cabe',
                  'Escolher sempre a maior amperagem sem validar o notebook',
                  'Trocar também a tela do notebook'
                ],
                correctAnswer: 0,
                explanation: 'Em baterias internas, a capacidade maior pode ocupar mais espaço. É preciso validar se o notebook comporta a peça.'
              },
              {
                id: 'intermediario-q7',
                question: 'No sistema Pai e Filho, o que caracteriza produtos Filhos?',
                options: [
                  'Variações que pertencem à mesma família de compatibilidade',
                  'Produtos sem relação com o produto Pai',
                  'Peças usadas apenas para teste interno',
                  'Produtos que nunca aparecem no Protheus'
                ],
                correctAnswer: 0,
                explanation: 'Produtos Filhos representam variações do produto Pai que não devem alterar a compatibilidade principal.'
              },
              {
                id: 'intermediario-q8',
                question: 'Quando duas referências aparecem separadas no Protheus, mas pertencem ao mesmo produto Pai, o que deve ser feito?',
                options: [
                  'Tratar automaticamente como produtos incompatíveis',
                  'Conferir se as variações pertencem à mesma família compatível',
                  'Excluir uma das referências',
                  'Indicar somente pela cor da peça'
                ],
                correctAnswer: 1,
                explanation: 'O Protheus pode separar variações. O atendimento precisa confirmar se elas pertencem à mesma família e se a variação não altera a compatibilidade.'
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
              title: 'Sites de análise de compatibilidade',
              image: [
                '/images/bateria/Avançado/baterias_avançado_p2_i3.png',
                '/images/bateria/Avançado/baterias_avançado_p2_i4.png',
                '/images/bateria/Avançado/baterias_avançado_p2_i5.png',
                '/images/bateria/Avançado/baterias_avançado_p2_i6.png',
                '/images/bateria/Avançado/baterias_avançado_p2_i7.png',
                '/images/bateria/Avançado/baterias_avançado_p2_i8.png'
              ],
              content: 'O principal site para análise de compatibilidade é o site da BB Baterias, por concentrar grande volume de aplicações.\n\nTambém é útil consultar referências nacionais e internacionais, como BringIt, ELGScreen, IrelandBattery, PartsPeople, HPLaptopBattery, BatteryEmpire e DellLaptopBattery. Essas consultas servem como apoio, não como substituição da validação técnica.',
            },
            {
              title: 'Identificando modelo da concorrência (BringIt)',
              image: [
                '/images/bateria/Avançado/baterias_avançado_p3_i2.png',
                '/images/bateria/slides/baterias_avancado_p4.png',
                '/images/bateria/slides/baterias_avancado_p5.png'
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
              image: '/images/bateria/slides/baterias_avancado_amperagem_exemplo.png',
              imagePlacement: 'afterContent',
              content: 'Existem casos em que duas baterias possuem o mesmo número de células, mas amperagens diferentes.\n\nIsso acontece porque a capacidade de cada célula pode variar de acordo com o fabricante. Uma célula pode ter, por exemplo, 2200mAh ou 2600mAh. Quanto maior o valor em mAh, maior tende a ser a autonomia da bateria.\n\nQuando a nossa bateria tem amperagem maior que a bateria antiga do cliente, podemos usar isso como argumento de venda. O cliente deve entender que terá mais tempo de uso fora da tomada.\n\nSe o cliente tinha uma bateria de 4400mAh e a nossa opção é de 5200mAh, esses 800mAh a mais podem representar aproximadamente 20% a 30% mais autonomia.\n\nExemplo:',
            },
            {
              title: 'Baterias com voltagens diferentes',
              image: [
                '/images/bateria/Avançado/baterias_avançado_p9_i2.jpeg',
                '/images/bateria/slides/baterias_avancado_voltagens_diferentes.png'
              ],
              content: 'Uma mesma linha de notebook pode ter sido produzida com baterias de números de células diferentes e, por consequência, voltagens diferentes.\n\nQuando a bateria nova tiver voltagem diferente da antiga, ela pode não ser reconhecida pelo equipamento. Nesses casos, confirme a voltagem da bateria original e indique uma substituição com a mesma especificação.',
            },
            {
              title: 'Incompatibilidade por Chipset',
              image: '/images/bateria/slides/baterias_avancado_chipset_exemplo.png',
              imagePlacement: 'afterContent',
              content: 'Todas as baterias de notebook possuem um chipset identificador. Esse chipset conversa com o notebook e informa dados como carga, ciclos e estado da bateria.\n\nQuando uma nova série de notebooks é lançada, o chipset da bateria pode ser atualizado. Nesses casos, duas baterias podem ser fisicamente iguais e até ter Part Numbers parecidos, mas a bateria antiga pode não ser reconhecida no notebook mais novo.\n\nPor isso, nesses atendimentos a pergunta principal é: qual é o modelo do notebook?\n\nSe o equipamento for de uma linha mais atual, indique também o modelo de bateria mais atual. Na dúvida, venda o modelo mais novo da linha, pois ele tende a manter compatibilidade com os modelos anteriores.\n\nExemplos de substituição por modelo mais atual:',
            },
            {
              title: 'Limpando o Histórico ACPI',
              image: [
                '/images/bateria/Avançado/baterias_avançado_p13_i2.jpeg',
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
              },
              {
                id: 'avancado-q2',
                question: 'Qual é a função dos sites de análise de compatibilidade no atendimento avançado?',
                options: [
                  'Servir como apoio para consulta e comparação de aplicações',
                  'Substituir completamente a validação técnica',
                  'Informar apenas preços de venda',
                  'Definir automaticamente a garantia do produto'
                ],
                correctAnswer: 0,
                explanation: 'Sites como BB Baterias, BringIt e referências internacionais ajudam na consulta, mas não eliminam a validação técnica.'
              },
              {
                id: 'avancado-q3',
                question: 'Ao usar a BringIt como referência, qual informação deve ser localizada primeiro?',
                options: [
                  'O SKU ou código do produto concorrente',
                  'A cor do botão de compra',
                  'O tamanho da fonte do site',
                  'O número de avaliações do produto'
                ],
                correctAnswer: 0,
                explanation: 'O SKU da concorrência permite procurar a equivalência no Tableau ou na planilha de códigos.'
              },
              {
                id: 'avancado-q4',
                question: 'Segundo a estimativa do treinamento, uma bateria de 4400mAh tende a durar aproximadamente quanto tempo?',
                options: [
                  '30 minutos',
                  '2h a 2h30',
                  '6h a 7h',
                  'Sempre exatamente 4h'
                ],
                correctAnswer: 1,
                explanation: 'A estimativa apresentada para 4400mAh é de aproximadamente 2h a 2h30, podendo variar conforme consumo do equipamento.'
              },
              {
                id: 'avancado-q5',
                question: 'Se a bateria antiga do cliente tem 4400mAh e a nova tem 5200mAh, qual argumento é correto?',
                options: [
                  'A nova tende a oferecer mais autonomia',
                  'A nova terá menos autonomia obrigatoriamente',
                  'A amperagem não influencia autonomia',
                  'A bateria não pode ser vendida por ter amperagem diferente'
                ],
                correctAnswer: 0,
                explanation: 'Com maior mAh, a bateria tende a oferecer mais autonomia, desde que a compatibilidade física e elétrica seja mantida.'
              },
              {
                id: 'avancado-q6',
                question: 'Quando uma linha de notebook possui baterias com voltagens diferentes, qual é a conduta mais segura?',
                options: [
                  'Confirmar a voltagem da bateria antiga e indicar uma equivalente',
                  'Escolher sempre a bateria com maior voltagem',
                  'Ignorar a voltagem e validar apenas a cor',
                  'Indicar qualquer bateria com o mesmo número de células'
                ],
                correctAnswer: 0,
                explanation: 'Quando há variações de voltagem na mesma linha, a troca por voltagem diferente pode não ser reconhecida. A validação pela bateria antiga é essencial.'
              },
              {
                id: 'avancado-q7',
                question: 'Em casos de incompatibilidade por chipset, qual pergunta deve ser priorizada?',
                options: [
                  'Qual é o modelo do notebook?',
                  'Qual é a cor da fonte?',
                  'Qual é o sistema operacional preferido?',
                  'Quantas portas USB o notebook tem?'
                ],
                correctAnswer: 0,
                explanation: 'O modelo do notebook define se é necessário indicar uma bateria com chipset mais atual.'
              },
              {
                id: 'avancado-q8',
                question: 'Por que, na dúvida, o treinamento orienta vender o modelo mais atual da linha?',
                options: [
                  'Porque ele tende a ser compatível com os modelos anteriores e evita falha de reconhecimento',
                  'Porque modelos antigos nunca funcionam em nenhum notebook',
                  'Porque ele sempre tem a mesma cor',
                  'Porque dispensa consultar o Part Number'
                ],
                correctAnswer: 0,
                explanation: 'O modelo mais atual tende a carregar o chipset atualizado e manter compatibilidade com aplicações anteriores da mesma linha.'
              },
              {
                id: 'avancado-q9',
                question: 'O que pode causar a bateria parar de carregar em 70% ou 80%, mesmo sem defeito físico?',
                options: [
                  'Recurso Battery Life Extender ou limitação de carga do fabricante',
                  'Falta de teclado numérico',
                  'Tela com baixa resolução',
                  'Part Number sempre incorreto'
                ],
                correctAnswer: 0,
                explanation: 'Alguns notebooks possuem recurso de preservação da bateria que limita a carga para reduzir temperatura e desgaste.'
              },
              {
                id: 'avancado-q10',
                question: 'Qual informação deve ser passada ao cliente quando a bateria nova tem menor mAh que a antiga?',
                options: [
                  'Que a autonomia pode ser menor e a diferença deve ser informada com transparência',
                  'Que a autonomia sempre será maior',
                  'Que mAh não tem relação com tempo de uso',
                  'Que a bateria não pode ligar o notebook'
                ],
                correctAnswer: 0,
                explanation: 'Quando a nova bateria tem menor capacidade, o cliente deve ser informado sobre a possível redução de autonomia antes da venda.'
              }
            ]
          }
        }
      }
    ]
  };
