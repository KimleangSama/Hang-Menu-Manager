import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs';
import Link from 'next/link';
import { Fragment } from 'react'

export function NavBreadcrumbs() {
    const items = useBreadcrumbs();
    if (items.length === 0) return null;
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <Fragment>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild={true}>
                            <Link href={'/dashboard'}>{'Dashboard'}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {items.length > 1 && (
                        <BreadcrumbSeparator className='hidden md:block' />
                    )}
                </Fragment>
                {items.map((item, index) => {
                    if (item?.title === 'Dashboard') return null;
                    return (
                        <Fragment key={item.title}>
                            {index !== items.length - 1 && (
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild={true}>
                                        {/* <Link href={item?.link}>{item?.title}</Link> */}
                                        <p>{item?.title}</p>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            )}
                            {index < items.length - 1 && (
                                <BreadcrumbSeparator className='hidden md:block' />
                            )}
                            {index === items.length - 1 && (
                                <BreadcrumbPage>{item.title}</BreadcrumbPage>
                            )}
                        </Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}