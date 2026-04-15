import React, { useState } from 'react';
import './AbyssalConstellation.css';

interface SkillNode {
  id: string;
  label: string;
  category: 'frontend' | 'backend' | 'ai' | 'tools';
  x: number;
  y: number;
  related: string[];
}

const SKILLS: SkillNode[] = [
  { id: 'angular', label: 'Angular', category: 'frontend', x: 20, y: 45, related: ['typescript', 'ionic', 'capacitor'] },
  { id: 'react', label: 'React', category: 'frontend', x: 30, y: 45, related: ['typescript'] },
  { id: 'typescript', label: 'TypeScript', category: 'frontend', x: 32, y: 35, related: ['angular'] },
  { id: 'ionic', label: 'Ionic', category: 'frontend', x: 25, y: 65, related: ['angular', 'capacitor'] },
  { id: 'capacitor', label: 'Capacitor', category: 'frontend', x: 38, y: 55, related: ['ionic', 'angular'] },

  { id: 'symfony', label: 'Symfony', category: 'backend', x: 45, y: 35, related: ['php', 'doctrine', 'api_platform'] },
  { id: 'php', label: 'PHP', category: 'backend', x: 55, y: 50, related: ['symfony'] },
  { id: 'doctrine', label: 'Doctrine', category: 'backend', x: 50, y: 25, related: ['symfony', 'api_platform'] },
  { id: 'api_platform', label: 'API Platform', category: 'backend', x: 55, y: 40, related: ['symfony', 'doctrine'] },

  { id: 'python', label: 'Python', category: 'ai', x: 60, y: 70, related: ['langchain', 'langgraph', 'sqlalchemy', 'mcp'] },
  { id: 'sqlalchemy', label: 'SQLAlchemy', category: 'ai', x: 55, y: 85, related: ['python'] },
  { id: 'langchain', label: 'LangChain', category: 'ai', x: 85, y: 65, related: ['python', 'langgraph', 'mcp'] },
  { id: 'langgraph', label: 'LangGraph', category: 'ai', x: 75, y: 75, related: ['langchain', 'python'] },
  { id: 'mcp', label: 'MCP Server', category: 'ai', x: 80, y: 55, related: ['langchain', 'python'] },

  { id: 'kubernetes', label: 'Kubernetes', category: 'tools', x: 75, y: 35, related: ['helm', 'argo'] },
  { id: 'helm', label: 'Helm', category: 'tools', x: 85, y: 20, related: ['kubernetes', 'argo'] },
  { id: 'argo', label: 'ArgoCD', category: 'tools', x: 65, y: 10, related: ['kubernetes', 'helm'] }
];

export function AbyssalConstellation() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const activeObj = activeNode ? SKILLS.find(s => s.id === activeNode) : null;

  return (
    <div className="constellation-container">

      <svg className="constellation-svg">
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.3" />
          </linearGradient>
        </defs>


        {!activeObj && SKILLS.map(source =>
          source.related.map(targetId => {
            const target = SKILLS.find(s => s.id === targetId);
            if (!target) return null;
            if (source.id > target.id) return null;
            return (
              <line
                key={`${source.id}-${target.id}`}
                x1={`${source.x}%`} y1={`${source.y}%`}
                x2={`${target.x}%`} y2={`${target.y}%`}
                className="constellation-line-faint"
              />
            );
          })
        )}


        {activeObj && activeObj.related.map((targetId, i) => {
          const target = SKILLS.find(s => s.id === targetId);
          if (!target) return null;
          return (
            <line
              key={`active-${activeObj.id}-${target.id}`}
              x1={`${activeObj.x}%`} y1={`${activeObj.y}%`}
              x2={`${target.x}%`} y2={`${target.y}%`}
              className="constellation-line-active"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          );
        })}
      </svg>


      {SKILLS.map((skill) => {
        const isActive = activeNode === skill.id;
        const isRelated = activeObj?.related.includes(skill.id);
        const isFaded = activeNode !== null && !isActive && !isRelated;

        return (
          <div
            key={skill.id}
            className={`constellation-node ${isActive ? 'node-active' : ''} ${isRelated ? 'node-related' : ''} ${isFaded ? 'node-faded' : ''} cat-${skill.category}`}
            style={{ left: `${skill.x}%`, top: `${skill.y}%` }}
            onMouseEnter={() => setActiveNode(skill.id)}
            onMouseLeave={() => setActiveNode(null)}
          >
            <div className="node-glow" />
            <div className="node-core" />
            <span className="node-label">{skill.label}</span>
          </div>
        );
      })}
    </div>
  );
}