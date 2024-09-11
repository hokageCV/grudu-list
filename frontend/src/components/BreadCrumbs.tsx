import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Breadcrumb = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  breadcrumbs: Breadcrumb[];
};

export default function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps){
  const router = useRouter();

  const isTasklistSecondToLast = breadcrumbs.length >= 3 && breadcrumbs[breadcrumbs.length - 2].label === 'TaskLists';

  return (
    <nav className="breadcrumbs text-sm" aria-label="breadcrumb">
      <ul className="flex space-x-2">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={index} className="inline-flex items-center">
              {isLast ? (
                <span className="text-gray-500">{breadcrumb.label}</span>
              ) : isTasklistSecondToLast && breadcrumb.label === 'TaskLists' ? (
                <span
                  onClick={() => router.back()}
                  className="hover:underline text-blue-600 cursor-pointer"
                >
                  {breadcrumb.label}
                </span>
              ) : (
                <Link href={breadcrumb.href || '#'} className="hover:underline text-blue-600">
                  {breadcrumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};