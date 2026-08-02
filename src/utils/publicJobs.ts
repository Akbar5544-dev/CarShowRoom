import {
  AnyRecord,
  asRecord,
  formatMoney,
  pickNumber,
  pickString,
  titleCase,
  unwrapData,
} from '../utils/apiHelpers';

export type PublicJobListItem = {
  id: string;
  slug: string;
  title: string;
  department: string;
  employmentType: string;
  city: string;
  country: string;
  experienceLabel: string;
  salaryLabel: string;
  showroomName: string;
  postedLabel: string;
};

export type PublicJobDetail = PublicJobListItem & {
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  workMode: string;
  openings: string;
  deadline: string;
};

function formatEmploymentType(raw: string): string {
  if (!raw) {
    return 'Full-time';
  }
  return titleCase(raw.replace(/-/g, ' '));
}

function formatExperience(row: AnyRecord): string {
  const years = pickNumber(row, [
    'min_experience',
    'experience_years',
    'years_of_experience',
    'experience',
  ]);
  if (years > 0) {
    return `${years}+ yrs`;
  }
  const label = pickString(row, ['experience_level', 'experience_label'], '');
  return label ? titleCase(label) : 'Any experience';
}

function formatSalary(row: AnyRecord): string {
  const min = pickNumber(row, ['salary_min', 'min_salary', 'salary_from']);
  const max = pickNumber(row, ['salary_max', 'max_salary', 'salary_to']);
  const currency = pickString(row, ['currency'], 'PKR') || 'PKR';
  if (min > 0 && max > 0) {
    return `${currency} ${min.toLocaleString('en-US')} – ${max.toLocaleString(
      'en-US',
    )}`;
  }
  if (min > 0) {
    return `From ${currency} ${min.toLocaleString('en-US')}`;
  }
  const raw = pickString(row, ['salary_range', 'salary', 'compensation'], '');
  if (raw) {
    return raw;
  }
  const estimated = pickNumber(row, ['estimated_cost']);
  return estimated > 0 ? formatMoney(estimated) : 'Salary not listed';
}

function formatPosted(row: AnyRecord): string {
  const raw = pickString(
    row,
    ['posted_at', 'published_at', 'created_at', 'updated_at'],
    '',
  );
  if (!raw) {
    return '';
  }
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function mapPublicJobListItem(item: unknown): PublicJobListItem {
  const row = asRecord(item);
  const showroom = asRecord(row.showroom ?? row.company);
  const id =
    pickString(row, ['id', 'uuid'], '') ||
    pickString(row, ['slug'], '') ||
    String(pickNumber(row, ['id']));
  const slug = pickString(row, ['slug', 'id'], id);
  const city = pickString(row, ['city', 'location_city', 'location'], '');
  const country = pickString(row, ['country'], '');

  return {
    id,
    slug,
    title: pickString(row, ['title', 'job_title', 'name'], 'Untitled role'),
    department: pickString(row, ['department'], 'General'),
    employmentType: formatEmploymentType(
      pickString(row, ['employment_type', 'type'], ''),
    ),
    city: city || 'Remote',
    country,
    experienceLabel: formatExperience(row),
    salaryLabel: formatSalary(row),
    showroomName: pickString(
      showroom,
      ['name', 'title', 'showroom_name'],
      pickString(row, ['showroom_name', 'company_name'], 'Showroom'),
    ),
    postedLabel: formatPosted(row),
  };
}

export function mapPublicJobDetail(item: unknown): PublicJobDetail {
  const row = asRecord(item);
  const base = mapPublicJobListItem(row);
  return {
    ...base,
    description: pickString(
      row,
      ['description', 'summary', 'about', 'overview'],
      '',
    ),
    responsibilities: pickString(
      row,
      ['responsibilities', 'what_youll_do', 'duties'],
      '',
    ),
    requirements: pickString(
      row,
      ['requirements', 'must_have', 'must_have_skills', 'qualifications'],
      '',
    ),
    benefits: pickString(row, ['benefits', 'perks'], ''),
    workMode: titleCase(
      pickString(row, ['work_mode', 'work_type', 'mode'], 'On-site') ||
        'On-site',
    ),
    openings: String(
      pickNumber(row, ['openings', 'positions', 'vacancies']) ||
        pickString(row, ['openings'], '1'),
    ),
    deadline: pickString(
      row,
      ['application_deadline', 'deadline', 'closes_at'],
      '',
    ),
  };
}

export type PublicJobFilters = {
  departments: string[];
  cities: string[];
  employmentTypes: string[];
};

export function mapPublicJobFilters(payload: unknown): PublicJobFilters {
  const data = asRecord(unwrapData(payload));
  return {
    departments: Array.isArray(data.departments)
      ? data.departments.map(String)
      : [],
    cities: Array.isArray(data.cities) ? data.cities.map(String) : [],
    employmentTypes: Array.isArray(data.employment_types)
      ? data.employment_types.map(String)
      : [],
  };
}
