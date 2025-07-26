import React, { useState } from 'react';
import './TechFeed.css';

const mockFeed = [
  {
    type: 'Hackathon',
    title: 'Smart India Hackathon 2025',
    date: '2025-08-10',
    link: 'https://www.sih.gov.in/',
    description: 'National level hackathon for solving real-world problems. Team registrations open!'
  },
  {
    type: 'Internship',
    title: 'Google Summer Internship',
    date: '2025-07-01',
    link: 'https://careers.google.com/',
    description: 'Apply for paid internships at Google. Open to all branches.'
  },
  {
    type: 'Tech News',
    title: 'OpenAI launches GPT-5',
    date: '2025-06-20',
    link: 'https://openai.com/',
    description: 'The next generation of AI language models is here.'
  },
  {
    type: 'Hackathon',
    title: 'Microsoft Imagine Cup',
    date: '2025-09-15',
    link: 'https://imaginecup.microsoft.com/',
    description: 'Global student technology competition. Win prizes and mentorship.'
  },
  {
    type: 'Internship',
    title: 'Amazon SDE Intern',
    date: '2025-07-15',
    link: 'https://www.amazon.jobs/en/',
    description: 'Software Development Engineer internships for pre-final year students.'
  }
];

const TechFeed = () => {
  const [feed] = useState(mockFeed);
  return (
    <div className="tech-feed-container">
      <h2>Tech News & Opportunities Feed</h2>
      <p className="tech-feed-desc">Stay updated with the latest hackathons, internships, and tech news!</p>
      <div className="tech-feed-list">
        {feed.map((item, idx) => (
          <div className="tech-feed-card" key={idx}>
            <div className={`feed-type ${item.type.toLowerCase()}`}>{item.type}</div>
            <h3>{item.title}</h3>
            <div className="feed-date">{new Date(item.date).toLocaleDateString()}</div>
            <p>{item.description}</p>
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="feed-link">Learn More</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechFeed; 