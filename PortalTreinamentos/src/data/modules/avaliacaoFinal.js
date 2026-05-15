export const avaliacaoFinalModule = {
  id: 7,
  title: 'Avaliação Final Produtos',
  icon: 'ClipboardCheck',
  color: '#14b8a6',
  description: 'Teste final geral dos módulos de produtos.',
  levels: [
    {
      id: 'teste-final',
      title: 'Teste Final',
      description: 'Avaliação consolidada de Baterias, Fontes, Telas, Teclados, Memórias e SSD.',
      lesson: {
        steps: [
          {
            title: 'Orientações da avaliação final',
            content: 'Esta avaliação reúne os principais pontos dos treinamentos de Baterias, Fontes, Telas, Teclados, Memórias e SSD.\n\nO objetivo é validar se o colaborador consegue aplicar os critérios de identificação, compatibilidade e atendimento em situações práticas.\n\nResponda com atenção. O resultado ficará disponível para acompanhamento do administrador master.',
          },
          {
            title: 'Conteúdos cobrados',
            content: 'Baterias: tipos, Part Number, capacidade, BMS, compatibilidade e problemas comuns.\n\nFontes: voltagem, amperagem, potência, pinos, USB-C e casos especiais.\n\nTelas: tamanho, iluminação, resolução, pinagem, brackets, narrow frame, touch e Part Numbers.\n\nTeclados: layout, encaixe, frame, backlight, topcase e funções especiais.\n\nMemórias: famílias DDR, DDR3L, frequência, capacidade e upgrade.\n\nSSD: SATA III, mSATA, M.2, NVMe, caddy, velocidades e compatibilidade.',
          },
          {
            title: 'Critério de leitura do resultado',
            content: 'A avaliação final possui 30 perguntas, distribuídas entre todos os produtos.\n\nUma nota acima de 80% indica boa preparação geral. Entre 60% e 79% indica que o colaborador deve revisar alguns temas. Abaixo de 60% indica necessidade de reforço antes de atuar com autonomia.\n\nO quiz pode ser refeito, e o painel do administrador master mostra as tentativas e o último resultado registrado.',
          },
        ],
        quiz: {
          title: 'Avaliação Final Produtos - Teste Final',
          questions: [
            {
              id: 'final-q1',
              question: 'Qual é o primeiro cuidado ao ouvir o cliente dizer que o notebook só funciona na tomada?',
              options: [
                'Encaminhar diretamente para troca da tela',
                'Investigar bateria, fonte e carregamento antes de concluir defeito',
                'Vender um SSD mais rápido',
                'Trocar o teclado por prevenção'
              ],
              correctAnswer: 1,
              explanation: 'Esse sintoma pode estar ligado à bateria, à fonte ou ao circuito de carga.'
            },
            {
              id: 'final-q2',
              question: 'Uma bateria externa de alta capacidade pode exigir qual orientação ao cliente?',
              options: [
                'Que ela sempre tem o mesmo volume da original',
                'Que pode alterar o formato físico e ficar mais saliente',
                'Que dispensa o uso de fonte',
                'Que só funciona em notebooks com touch'
              ],
              correctAnswer: 1,
              explanation: 'Baterias de maior capacidade podem ter mais células e mudar o volume físico.'
            },
            {
              id: 'final-q3',
              question: 'Ao avaliar uma bateria, por que o Part Number é mais confiável que apenas o modelo do notebook?',
              options: [
                'Porque todo notebook usa apenas uma bateria',
                'Porque o mesmo notebook pode aceitar baterias diferentes',
                'Porque o modelo do notebook nunca importa',
                'Porque o Part Number não precisa de validação'
              ],
              correctAnswer: 1,
              explanation: 'Um mesmo modelo de notebook pode ter variações de bateria conforme série e revisão.'
            },
            {
              id: 'final-q4',
              question: 'Na fonte, qual conjunto deve ser conferido antes de indicar a peça?',
              options: [
                'Voltagem, amperagem, potência e conector',
                'Cor da carcaça, teclado e webcam',
                'Sistema operacional, touch e resolução',
                'Somente a marca do notebook'
              ],
              correctAnswer: 0,
              explanation: 'A fonte precisa bater em voltagem, corrente, potência e conector.'
            },
            {
              id: 'final-q5',
              question: 'Qual afirmação é correta sobre USB-C nas fontes?',
              options: [
                'Todo USB-C serve em qualquer notebook',
                'USB-C padroniza o conector, mas a potência e a compatibilidade ainda precisam ser verificadas',
                'USB-C elimina a necessidade de checar potência',
                'USB-C é exclusivo de carregadores de celular'
              ],
              correctAnswer: 1,
              explanation: 'O formato ajuda, mas a potência e o suporte do equipamento continuam obrigatórios.'
            },
            {
              id: 'final-q6',
              question: 'Ao vender uma fonte para notebook gamer, o que costuma ter mais peso?',
              options: [
                'Fonte de maior potência compatível com o modelo',
                'A menor potência possível',
                'A cor do cabo',
                'O tamanho da embalagem'
              ],
              correctAnswer: 0,
              explanation: 'Notebooks mais exigentes pedem fontes com potência compatível com o projeto.'
            },
            {
              id: 'final-q7',
              question: 'Para identificar uma tela com segurança, o que não pode ficar de fora?',
              options: [
                'Apenas a polegada',
                'Modelo, resolução, pinagem, tecnologia e encaixe',
                'Somente a marca impressa na moldura',
                'Só a presença de imagem'
              ],
              correctAnswer: 1,
              explanation: 'Tela depende de conjunto de critérios físicos e elétricos, não de um único dado.'
            },
            {
              id: 'final-q8',
              question: 'Qual diferença prática existe entre LED e CCFL?',
              options: [
                'LED usa tecnologia mais nova; CCFL costuma exigir cabo extra de iluminação',
                'CCFL é sempre touch',
                'LED só existe em tela de 17,3',
                'CCFL não usa nenhum cabo'
              ],
              correctAnswer: 0,
              explanation: 'CCFL é uma tecnologia antiga e costuma ter cabo extra de alimentação da lâmpada.'
            },
            {
              id: 'final-q9',
              question: 'Quando uma tela é narrow frame, qual cuidado é obrigatório?',
              options: [
                'Ignorar brackets e medir só a polegada',
                'Validar dimensões, suporte e posição do conector',
                'Trocar sempre por uma tela convencional',
                'Escolher qualquer tela IPS'
              ],
              correctAnswer: 1,
              explanation: 'Narrow frame muda encaixe e medidas, então a validação física é essencial.'
            },
            {
              id: 'final-q10',
              question: 'Uma tela touch não deve ser tratada só pela resolução porque:',
              options: [
                'touch envolve conjunto específico e integração física',
                'touch elimina a necessidade de cabo',
                'touch é só um nome comercial',
                'touch só existe em laptops antigos'
              ],
              correctAnswer: 0,
              explanation: 'Telas touch podem exigir conjunto específico e encaixe próprio.'
            },
            {
              id: 'final-q11',
              question: 'Em teclados, o que mais costuma exigir validação antes da venda?',
              options: [
                'Layout, frame, flat e presença de backlight',
                'A cor do adesivo da embalagem',
                'A resolução da tela',
                'A potência da fonte'
              ],
              correctAnswer: 0,
              explanation: 'Teclado depende de layout, encaixe e recursos como iluminação.'
            },
            {
              id: 'final-q12',
              question: 'Qual diferença ajuda a separar teclado avulso de topcase?',
              options: [
                'Topcase inclui a carcaça superior',
                'Topcase é sempre um SSD',
                'Teclado avulso nunca tem flat',
                'Topcase só serve em notebooks de 15,6'
              ],
              correctAnswer: 0,
              explanation: 'Topcase é um conjunto maior e muda a análise de instalação.'
            },
            {
              id: 'final-q13',
              question: 'Quando um teclado vem com backlight, o que deve ser conferido?',
              options: [
                'Se o notebook aceita iluminação e se o cabo/função estão presentes',
                'Se a tela é IPS',
                'Se a bateria é externa',
                'Se o SSD é NVMe'
              ],
              correctAnswer: 0,
              explanation: 'Sem suporte ao backlight, a iluminação pode não funcionar.'
            },
            {
              id: 'final-q14',
              question: 'Qual cuidado é importante em teclados com pointstick?',
              options: [
                'Confirmar se o modelo realmente usa esse recurso',
                'Substituir por qualquer teclado US',
                'Ignorar o encaixe físico',
                'Vender apenas pelo preço'
              ],
              correctAnswer: 0,
              explanation: 'O pointstick faz parte da configuração do conjunto e precisa bater com o modelo.'
            },
            {
              id: 'final-q15',
              question: 'Ao tratar de memória, por que DDR3 e DDR3L não devem ser confundidas?',
              options: [
                'Porque têm tensões diferentes e a compatibilidade muda',
                'Porque DDR3L é apenas um nome comercial',
                'Porque DDR3 não funciona em notebook',
                'Porque a frequência não importa'
              ],
              correctAnswer: 0,
              explanation: 'DDR3L trabalha em baixa tensão e não é substituta automática da DDR3.'
            },
            {
              id: 'final-q16',
              question: 'Se o notebook aceita memórias de frequências diferentes, qual é o comportamento mais comum?',
              options: [
                'O conjunto tende a trabalhar na frequência mais baixa compatível',
                'As frequências se somam',
                'A memória mais rápida deixa de funcionar',
                'A frequência não influencia em nada'
              ],
              correctAnswer: 0,
              explanation: 'Em módulos compatíveis, o sistema tende a operar no menor denominador comum.'
            },
            {
              id: 'final-q17',
              question: 'Na venda de memória, o que precisa ser conferido além da família DDR?',
              options: [
                'Limite máximo do equipamento e quantidade de slots',
                'Cor do gabinete',
                'Tipo da webcam',
                'Modelo da bateria'
              ],
              correctAnswer: 0,
              explanation: 'Capacidade máxima e slots disponíveis influenciam diretamente o upgrade.'
            },
            {
              id: 'final-q18',
              question: 'Quando o notebook tem 4 GB ocupando um slot e o cliente quer mais desempenho, qual é uma abordagem técnica?',
              options: [
                'Verificar se o módulo atual pode ser substituído por outro maior e compatível',
                'Adicionar outro módulo mesmo sem slot',
                'Trocar o teclado por um maior',
                'Instalar uma tela Full HD'
              ],
              correctAnswer: 0,
              explanation: 'Se não há slot livre, a solução pode ser trocar o módulo existente por outro maior.'
            },
            {
              id: 'final-q19',
              question: 'Qual afirmação é verdadeira sobre SSD SATA III?',
              options: [
                'É uma opção comum para upgrade em notebooks com interface SATA',
                'Só funciona em desktop',
                'É sempre mais lento que HD mecânico',
                'Dispensa checar compatibilidade'
              ],
              correctAnswer: 0,
              explanation: 'SATA III é uma solução frequente para melhorar desempenho em notebooks compatíveis.'
            },
            {
              id: 'final-q20',
              question: 'Para SSD M.2, qual diferença precisa ser confirmada?',
              options: [
                'O protocolo aceito pelo notebook e o tamanho físico do módulo',
                'A cor do dissipador',
                'A marca da bateria',
                'O tipo de teclado'
              ],
              correctAnswer: 0,
              explanation: 'M.2 é formato físico; o protocolo pode ser SATA ou NVMe, e o comprimento também importa.'
            },
            {
              id: 'final-q21',
              question: 'Quando o notebook tem leitor de DVD e o cliente quer manter espaço extra, o que pode ser uma saída?',
              options: [
                'Usar caddy para reaproveitar o drive óptico',
                'Trocar a tela por uma touch',
                'Remover a fonte',
                'Diminuir a resolução do Windows'
              ],
              correctAnswer: 0,
              explanation: 'O caddy permite instalar outro disco no espaço do leitor de DVD, quando o equipamento suporta.'
            },
            {
              id: 'final-q22',
              question: 'Qual é a lógica correta ao priorizar desempenho em SSD?',
              options: [
                'Confirmar compatibilidade antes de indicar o padrão mais rápido',
                'Vender NVMe automaticamente',
                'Indicar qualquer M.2 sem validar o notebook',
                'Escolher só pelo preço'
              ],
              correctAnswer: 0,
              explanation: 'Velocidade não substitui compatibilidade de interface, tamanho e suporte.'
            },
            {
              id: 'final-q23',
              question: 'Quando o cliente quer manter muitos arquivos e acelerar o sistema, qual solução faz sentido?',
              options: [
                'SSD para sistema e HD para arquivos, se o notebook permitir',
                'Trocar apenas a bateria',
                'Reduzir a memória RAM',
                'Instalar teclado com backlight'
              ],
              correctAnswer: 0,
              explanation: 'A combinação SSD + HD é útil quando o equipamento aceita esse arranjo.'
            },
            {
              id: 'final-q24',
              question: 'Por que um equipamento pode não aceitar um upgrade de resolução de tela?',
              options: [
                'Porque placa, cabo e modelo podem não suportar a troca',
                'Porque toda tela Full HD funciona em qualquer notebook',
                'Porque resolução não tem impacto técnico',
                'Porque o teclado não está iluminado'
              ],
              correctAnswer: 0,
              explanation: 'A compatibilidade de resolução depende do conjunto do notebook, não só do painel.'
            },
            {
              id: 'final-q25',
              question: 'Ao comparar dois modelos de tela, qual é a postura mais segura?',
              options: [
                'Comparar Part Number e características técnicas em bases confiáveis',
                'Escolher pelo nome mais curto',
                'Usar apenas a polegada',
                'Ignorar pinagem e encaixe'
              ],
              correctAnswer: 0,
              explanation: 'A comparação precisa validar modelo, tecnologia, resolução e aplicação.'
            },
            {
              id: 'final-q26',
              question: 'Quando a fonte tem potência menor que a exigida pelo notebook, qual risco existe?',
              options: [
                'Carregamento instável e possível aquecimento ou desempenho ruim',
                'A tela ficar touch',
                'A memória virar DDR4',
                'O teclado ganhar pointstick'
              ],
              correctAnswer: 0,
              explanation: 'Fonte subdimensionada pode gerar aquecimento e carregamento inadequado.'
            },
            {
              id: 'final-q27',
              question: 'Em uma bateria, qual componente regula carga e proteção?',
              options: [
                'BMS',
                'SSD',
                'Bracket',
                'Touchpad'
              ],
              correctAnswer: 0,
              explanation: 'O BMS gerencia carga e proteção da bateria.'
            },
            {
              id: 'final-q28',
              question: 'Qual fator acelera desgaste da bateria com frequência?',
              options: [
                'Calor excessivo e muitos ciclos de carga',
                'Uso de fonte correta',
                'Troca de SSD',
                'Uso de teclado original'
              ],
              correctAnswer: 0,
              explanation: 'Temperatura elevada e ciclos repetidos reduzem a vida útil das células.'
            },
            {
              id: 'final-q29',
              question: 'Se o notebook não reconhece uma bateria nova, qual checagem é razoável antes de concluir defeito?',
              options: [
                'Verificar BIOS, driver ACPI e reconhecimento do sistema',
                'Trocar a tela',
                'Reduzir a RAM',
                'Alterar o layout do teclado'
              ],
              correctAnswer: 0,
              explanation: 'Nem sempre o problema é físico; BIOS e driver podem afetar o reconhecimento.'
            },
            {
              id: 'final-q30',
              question: 'Qual é a melhor regra geral para qualquer produto do treinamento?',
              options: [
                'Sempre validar modelo, referência e características técnicas antes de vender',
                'Escolher o item mais barato',
                'Usar só a aparência',
                'Ignorar o Part Number'
              ],
              correctAnswer: 0,
              explanation: 'A validação técnica evita erro de compatibilidade e reduz retrabalho.'
            }
          ]
        }
      }
    }
  ]
};
