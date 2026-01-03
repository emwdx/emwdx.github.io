const PROFICIENCY_SCALES = {
  course: "Changemakers",
  scales: [
    {
      id: "creativity",
      title: "Creativity Proficiency Scale",
      focusAreas: [
        "Novelty and usefulness",
        "Brainstorming, experimentation, iteration",
        "Selecting and elaborating"
      ],
      levels: [
        {
          level: "4.0",
          summary:
            "Demonstrates in-depth synthesis and application of ideas with complexity or integration.",
          criteria: [
            "Produces a product that is novel, useful, and exceptionally original yet practical.",
            "Shows evidence of multiple design cycles that explore possibilities and integrate stakeholder feedback.",
            "Synthesizes and combines multiple perspectives to show a deep understanding of the problem or objectives."
          ]
        },
        {
          level: "3.0",
          summary:
            "Independently generates and iterates on ideas to produce a novel and useful product.",
          criteria: [
            "Creates a product that is both novel and useful for the problem or objectives.",
            "Explores a range of ideas with varied tools and protocols during the design process.",
            "Explains how the developed product demonstrates a detailed understanding of the problem or objectives."
          ]
        },
        {
          level: "2.0",
          summary: "Produces a useful idea with guided brainstorming and iteration.",
          criteria: [
            "Creates a product that is useful for the problem or objectives.",
            "Generates and iterates on ideas using teacher-directed tools and protocols.",
            "Selects from teacher-provided options and explains how the choice addresses the problem or objectives."
          ]
        }
      ]
    },
    {
      id: "collaboration",
      title: "Collaboration Proficiency Scale",
      focusAreas: [
        "Team strategy",
        "Self-awareness and contribution",
        "Conflict resolution and feedback"
      ],
      levels: [
        {
          level: "4.0",
          summary:
            "Articulates and applies collaborative practices tailored to team context and dynamics.",
          criteria: [
            "Designs and implements strategies to improve team efficiency based on member strengths and weaknesses.",
            "Evaluates strengths and weaknesses of personal contributions to the team and project.",
            "Uses self-awareness to decide when to support the team and when to lead."
          ]
        },
        {
          level: "3.0",
          summary:
            "Communicates clearly, participates actively, and fulfills responsibilities within the team.",
          criteria: [
            "Leverages team members’ knowledge, skills, and experiences to advance the project.",
            "Gives, reflects on, and acts on constructive feedback.",
            "Resolves conflicts effectively and meets deadlines and responsibilities."
          ]
        },
        {
          level: "2.0",
          summary: "Participates with basic collaboration skills and awareness.",
          criteria: [
            "Paraphrases and listens to teammates.",
            "Identifies when problems arise and describes conflict resolution strategies.",
            "Identifies next steps, timelines, personal collaboration goals, team agreements, and can give feedback to group members."
          ]
        }
      ]
    },
    {
      id: "adaptive-thinking",
      title: "Adaptive Thinking Proficiency Scale",
      focusAreas: [
        "Anticipating and adapting",
        "Systems thinking",
        "Evidence use and sensemaking"
      ],
      levels: [
        {
          level: "4.0",
          summary:
            "Anticipates challenges and adapts thinking proactively using evidence across systems and perspectives.",
          criteria: [
            "Synthesizes insights across systems, perspectives, or models to uncover interrelationships, inconsistencies, or counterexamples.",
            "Uses adaptive reasoning to question assumptions, integrate new insights, and refine solutions in changing or conflicting contexts.",
            "Draws evidence-based inferences from diverse sources, weighing claims, counterclaims, and limitations."
          ]
        },
        {
          level: "3.0",
          summary:
            "Applies systems thinking and evidence to analyze complex problems from multiple perspectives.",
          criteria: [
            "Articulates multiple perspectives and arguments related to a complex problem.",
            "Selects and applies relevant evidence from varied sources to make and defend claims.",
            "Uses systems thinking tools (e.g., root cause analysis, iceberg model, pre-mortems) to identify patterns and contributing factors.",
            "Recognizes when information may be incomplete, conflicting, or irrelevant."
          ]
        },
        {
          level: "2.0",
          summary:
            "Identifies a single perspective and summarizes key ideas with basic source evaluation.",
          criteria: [
            "Describes one perspective related to a complex problem.",
            "Summarizes key ideas from multiple sources.",
            "Identifies strengths and limitations of sources using basic criteria (e.g., CRAAP Test).",
            "Uses academic structure (claim, evidence, source/viewpoint, credibility, cause and effect) with proper citation."
          ]
        }
      ]
    },
    {
      id: "communication",
      title: "Communication Proficiency Scale",
      focusAreas: [
        "Audience awareness",
        "Organization and clarity",
        "Craftsmanship and conventions"
      ],
      levels: [
        {
          level: "4.0",
          summary:
            "Adapts tools and strategies to diverse audiences while applying sophisticated craftsmanship.",
          criteria: [
            "Extends depth and quality by following, adapting, or intentionally breaking conventions of a medium or style.",
            "Selects communication tools and strategies to meet audience needs."
          ]
        },
        {
          level: "3.0",
          summary:
            "Communicates information in an organized, engaging way with strong content-specific language.",
          criteria: [
            "Uses precise, descriptive, and content-specific knowledge to enhance the message.",
            "Applies craftsmanship by following conventions of a medium or style."
          ]
        },
        {
          level: "2.0",
          summary:
            "Plans communication with awareness of audience, organization, and conventions.",
          criteria: [
            "Identifies strategies to engage an audience.",
            "Plans organization of the message.",
            "Shows awareness of medium conventions and elements of craftsmanship."
          ]
        }
      ]
    },
    {
      id: "action-advocacy",
      title: "Action & Advocacy Proficiency Scale",
      focusAreas: [
        "Stakeholder engagement",
        "Implementation",
        "Impact and sustainability"
      ],
      levels: [
        {
          level: "4.0",
          summary:
            "Completes meaningful change with sustained community impact or plans for ongoing impact.",
          criteria: [
            "Maintains consistent stakeholder involvement.",
            "Shows noticeable improvements and lasting sustainability in implementation."
          ]
        },
        {
          level: "3.0",
          summary:
            "Implements solutions with stakeholder feedback and analyzes impact.",
          criteria: [
            "Builds ongoing connections with communities and individuals connected to the project.",
            "Implements a solution based on multiple perspectives and feedback.",
            "Analyzes impact, including successes and failures in implementation."
          ]
        },
        {
          level: "2.0",
          summary:
            "Prepares for action with empathy work and a proposed change.",
          criteria: [
            "Plans and prepares for empathy chats.",
            "Captures stakeholder perspectives reflecting issue complexity.",
            "Proposes a change, service opportunity, or action plan based on stakeholder needs."
          ]
        }
      ]
    }
  ],
  assessmentNotes: [
    "L1.5 assessment: quick completion check.",
    "L2 assessment: foundational knowledge at the 2.0 level; takes more teacher time.",
    "L3 assessment: longer, in-depth proficiency demonstration."
  ]
};

const PROFICIENCY_SCALES_TEXT = JSON.stringify(PROFICIENCY_SCALES, null, 2);
