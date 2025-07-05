import React from 'react';
import { Template } from '../types/editor';
import { defaultTemplates } from '../data/templates';
import { Layout, Sparkles } from 'lucide-react';

interface TemplateSelectorProps {
  onSelectTemplate: (template: Template) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 min-h-[180px]">
      <div className="flex items-center gap-3 mb-4">
        <Layout className="w-6 h-6 text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-900">Plantillas</h3>
      </div>
      {/* Desktop: grid, Mobile: carrusel */}
      <div className="hidden lg:grid grid-cols-2 gap-3 mb-2">
        {defaultTemplates.map((template, index) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className={`group relative overflow-hidden rounded-lg border-2 transition-all duration-200 hover:shadow-md flex-shrink-0 ${
              index === 0 
                ? 'border-orange-500 ring-2 ring-orange-200'
                : 'border-gray-200 hover:border-orange-300'
            }`}
            style={{ width: '100%', height: '70px' }}
          >
            <div
              className="w-full h-full flex items-center justify-center text-white text-base font-medium relative"
              style={{ background: template.background }}
            >
              <div className={`absolute inset-0 transition-all duration-200 ${
                index === 0 
                  ? 'bg-black bg-opacity-10' 
                  : 'bg-black bg-opacity-20 group-hover:bg-opacity-10'
              }`} />
              <div className="relative z-10 flex flex-col items-center gap-2 text-center px-2">
                <Sparkles className="w-4 h-4" />
                <span className="leading-tight text-base">{template.name}</span>
                {index === 0 && (
                  <span className="text-xs bg-indigo-500 px-1 py-0.5 rounded text-white">
                    Por defecto
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
      {/* Mobile: carrusel horizontal */}
      <div className="lg:hidden overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-max">
          {defaultTemplates.map((template, index) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className={`group relative overflow-hidden rounded-lg border-2 transition-all duration-200 hover:shadow-md flex-shrink-0 ${
                index === 0 
                  ? 'border-orange-500 ring-2 ring-orange-200'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
              style={{ width: '120px', height: '70px' }}
            >
              <div
                className="w-full h-full flex items-center justify-center text-white text-base font-medium relative"
                style={{ background: template.background }}
              >
                <div className={`absolute inset-0 transition-all duration-200 ${
                  index === 0 
                    ? 'bg-black bg-opacity-10' 
                    : 'bg-black bg-opacity-20 group-hover:bg-opacity-10'
                }`} />
                <div className="relative z-10 flex flex-col items-center gap-2 text-center px-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="leading-tight text-base">{template.name}</span>
                  {index === 0 && (
                    <span className="text-xs bg-indigo-500 px-1 py-0.5 rounded text-white">
                      Por defecto
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 text-sm text-gray-500 text-center">
        Desliza para ver más plantillas
      </div>
    </div>
  );
};

export default TemplateSelector;