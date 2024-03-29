export default {
  menu: {
    login: 'connexion',
    signup: 'inscription',
    legalNotice: 'Mention légales',
    termsAndConditions: "Conditions Générales d'Utilisation",
    about: 'à propos',
    tutorial:'tutorial',
  },
  tutorial:{
    title:'Tutorial',
    head:'Comment utiliser l\'outil e-spectateur?',
    download:'Vous pouvez télécharger le tutorial en cliquant sur',
    user:'Avec e-spect@teur, vous pouvez être créateur de projet ou simplement participer à un projet existant.',
    join:'Comment rejoindre e-specta@teur',
    create:'Si vous souhaitez créer un projet, vous devez:', 
    use:'Utiliser e-spectateur'
  },
  static:{
    dataLabel:'nombre de réaction',
    title: 'Résultat des annotations de la pièce ', 
  },
  home: {
    logo:'E-spect@teur',
    title: 'Apprendre ensemble avec une vidéo',
    description:
      'Partagez une vidéo PeerTube avec vos élèves, vos' +
      ' étudiant.e.s ou un groupe en formation : créez' +
      ' votre projet pédagogique, annotez les images,' +
      ' posez des questions et répondez à celles des' +
      ' participant.e.s.',
    teachers: 'Créer un projet',
    students: 'Collaborer sur un Projet',
    addVideo: 'Ajoutez un lien vers une vidéo PeerTube...',
    newProject: 'Nouveau projet',
    joinProject: 'Rejoindre un projet',
    searchProject: 'Rechercher un projet…',
    myProjects: 'Mes projets',
    publicProjects: 'Projets publics',
    emptySearchResult: 'Aucun projet ne correspond à votre recherche',
  },

  about: {
    logo:'E-spect@teur',
    title: 'À propos',
    intro: {
      prefix: 'Le développement de la plateforme ',
      suffix:
        ' s’inscrit dans le cadre d’un projet de recherche' +
        ' porté par Michaël Bourgatte et Laurent Tessier au sein' +
        ' de l’Atelier du Numérique de l’Institut Catholique de Paris.',
    },
    support:
      'Le développement de cette plateforme d’annotation vidéo' +
      ' à vocation pédagogique a bénéficié du soutien de la' +
      ' Fondation Saint Matthieu.',
    opensource: {
      prefix:
        'Celluloid est un projet Open Source développé par Erwan' +
        ' Queffélec avec la participation de Souleymane Thiam et de Guillaume Aichhorn' +
        " dans le cadre d'un partenariat avec La Paillasse." +
        ' L’ensemble du code est accessible librement ',
      github: 'sur GitHub',
    },
  },

  guide: {
    title: 'Guide utilisateur',
    intro: {
      prefix: 'Comment utiliser E-spectateur pour annoter une vidéo?  ',
      // suffix: ' s’inscrit dans le cadre d’un projet de recherche'
      //   + ' porté par Michaël Bourgatte et Laurent Tessier au sein'
      //   + ' de l’Atelier du Numérique de l’Institut Catholique de Paris.'
    },
    support:
      'Si vous êtes collaborateur sur un projet existant et' +
      ' vous souahitez le joindre veuillez suivre les consignes suivantes: ',
    step1: 'Open the web page',
    step2: 'On the landing page, click ' + ' "JOIN PROJECT"',
    step3: 'Enter the project code',
    step4: 'Enter your username and an last name',
    step5: 'Make sure to read carefully the objective and assignments!',
    step6:
      "Complete the assignments and annotate the video while it's playing!",
    opensource: {
      prefix:
        'Celluloid est un projet Open Source développé par Erwan' +
        ' Queffélec avec la participation de Souleymane Thiam et de Guillaume Aichhorn' +
        " dans le cadre d'un partenariat avec La Paillasse." +
        ' L’ensemble du code est accessible librement ',
      github: 'sur GitHub',
    },
  },

  signin: {
    signupTitle: 'Inscription',
    loginTitle: 'Connexion',
    confirmSignupTitle: 'Confirmation',
    forgotPasswordTitle: 'Mot de passe perdu',
    joinProjectTitle: 'Rejoindre un projet',

    login: "Email ou nom d'utilisateur",
    username: 'Prenom ou pseudo',
    code: 'Code de confirmation',
    email: 'Adresse email',
    password: 'Mot de passe',
    lastName: 'Nom de famille',
    projectCode: 'Code du projet',
    confirmPassword: 'Confirmer le mot de passe',

    passwordHelper: '8 caractères minimum',
    codeHelper: 'Ce code vous a été envoyé par email',
    passwordMismatch: 'Les mots de passe ne correspondent pas',

    notRegistered: 'Pas encore de compte ?',
    alreadyRegistered: 'Déjà un compte ?',
    rememberlastName: 'Votre nom de famille vous servira de mot de passe',

    resetAction: 'mettre à jour',
    resendCodeAction: 'Envoyer un nouveau code',
    confirmSignupAction: "Confirmer l'inscription",
    signupAction: "s'inscrire",
    forgotPasswordAction: 'mot de passe oublié',
    loginAction: 'se connecter',
    changePasswordAction: 'changer le mot de passe',
    joinAction: 'rejoindre',

    upgradeAccountMessage:
      'Pour continuer, vous devez renseigner' +
      ' votre adresse email et un mot de passe',
    signupOrLoginMessage:
      'Pour continuer, vous devez vous inscrire' + ' ou vous connecter',
  },

  notFound: {
    title: 'Page introuvable :(',
    description:
      'La page que vous cherchez est peut-être privée' +
      ' ou à peut-être été supprimée',
    action: "retour à l'accueil",
  },

  project: {
    createAction: 'Créer le projet',
    cancelAction: 'Annuler',
    createTitle: 'Nouveau projet',
    objective: 'Objectif',
    assignment: 'Exercice',
    title: 'Titre',
    description: 'Description',
    public: 'Public',
    collaborative: 'Collaboratif',
    performance: 'Performance',
    autoDetect: 'Détection automatique',
    semiAutoDetect: "Recommandation d'Emoji",
    semiAutoDetectOnlyMe: "Recommandation d'Emoji (Moi Uniquement)",
    analyze: 'Analyse',
    sequencing: 'Sequencing',
    shared: 'Partage',
    exportButton: 'EXPORTER',
    ownAnnotations: 'Moi seulement',
    annotationsVisibilitySelector: 'Annotations',
    annotationsVisibilityAll: 'Toutes',
    members: '{{ count }} participant',
    members_plural: '{{ count }} participants',
    URL_title: 'URL de la vidéo',
    videoUrlHelper: 'Lien vers la vidéo originale',
    titleHelper: 'Donnez un titre à votre projet',
    descriptionHelper: 'Décrivez brièvement le contenu de la vidéo',
    objectiveHelper: "Fixez l'objectif pédagogique du projet",
    assignmentsHelper:
      'Listez les différentes activités que' + ' vous proposez au partcipants',
    tagsHelper:
      'Choisissez un ou plusieurs domaines correspondant' + ' à votre projet',
    levelsHelper: "Veuillez préciser à quels niveaux s'adresse" + ' ce projet',
    publicHelper:
      'Rendre un projet public signifie que tous' +
      ' les utilisateurs de la plateforme pourront le consulter,' +
      ' mais ils ne pourront' +
      ' pas y participer, ni voir les annotations.',
    collaborativeHelper:
      '`Rendre un projet collaboratif signifie' +
      ' que les personnes que vous invitez pourront annoter la' +
      ' vidéo. Si le projet n’est pas collaboratif, vous seul.e' +
      ' pourrez annoter la vidéo.',

    assignmentsSection: 'Activités proposées',
    tagsSection: 'Domaines',
    levelsSection: 'Niveau',
    visibilitySection: 'Partage',

    assignmentPlaceholder: 'Ajoutez une activité',
    tagsPlaceholder: 'Recherchez ou ajoutez un autre domaine…',

    codeWarning: {
      title: 'Partagez ce code avec vos élèves. ',
      description:
        'Ce code sera disponible sur la page de projet' +
        ' Vous pouvez le réinitialiser en partageant' +
        ' à nouveau le projet.',
    },
 
    share: {
      dialog: {
        description:
          'Pour ouvrir une fiche pédagogique' +
          ' imprimable dans une nouvelle fenêtre, ',
        linkText: 'cliquez ici',
      },
      guide: {
        title: 'Fiche pédagogique',
        subtitle: 'Comment utiliser Celluloid ?',
        step1: 'Allez sur le site internet',
        step2: "Sur la page d'accueil, cliquez sur " + ' "rejoindre un projet"',
        step3: 'Entrez le code du projet',
        step4: 'Indiquez votre nom et une réponse secrète',
        step5: "Lisez bien les consignes et l'exercice",
        step6:
          "Réalisez l'exercice et annotez la vidéo" + ' au fil de la lecture',
      },
    },
    creatorRole: 'Créateur',
  },

  update: {
    message:
      "L'application a été mise à jour." + ' Veuillez rafraîchir la page.',
    action: 'Rafraîchir',
  },

  annotation: {
    pauseLabel: 'mettre en pause ?',
    contentPlaceholder: 'Saisissez votre annotation…',
    commentPlaceholder: 'Laissez un commentaire…',
    hintLabel: '{{count}} annotation',
    hintLabel_plural: '{{count}} annotations',
    hintLabelNone: 'Aucune annotation',
    commentLabel: '{{count}} commentaire',
    commentLabel_plural: '{{count}} commentaires',
  },

  tagSearch: {
    createLabel: 'Créer le domaine',
    prefix: 'Domaine : ',
  },

  levels: {
    kinderGarten: 'Cycle 1',
    elementarySchool1: 'Cycle 2',
    elementarySchool2: 'Cycle 3',
    middleSchool: 'Collège',
    highSchool: 'Lycée',
    higherEducation: 'Supérieur',
    research: 'Recherche',
  },

  createAction: 'Enregistrer',
  cancelAction: 'Annuler',
  deleteAction: 'Supprimer',
  shareAction: 'Partager',
  printAction: 'Imprimer',
};
