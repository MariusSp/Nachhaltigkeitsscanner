package de.uniwue.nachhaltigkeitsscanner.utils;

import de.uniwue.nachhaltigkeitsscanner.entities.Company_;
import org.hibernate.Session;
import org.springframework.stereotype.Component;

import de.uniwue.nachhaltigkeitsscanner.entities.Company;
import org.springframework.util.Assert;

import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Predicate;
import javax.persistence.TypedQuery;
import java.util.List;

@Component
public final class CompanyUtils {

    //Name refers to Company Name
    //userid refers to user who is in charge of company
    public static Company findCompany(String userid, String name) {
        Session session = HibernateUtils.getSession();
        CriteriaBuilder qb = session.getCriteriaBuilder();
        CriteriaQuery<Company> c = qb.createQuery(Company.class);
        Root<Company> root = c.from(Company.class);

        Predicate condition;
        if (userid != null) {
            condition = qb.equal(root.get(Company_.userId), userid);

        } else {
            condition = qb.equal(root.get(Company_.name), name);
        }
        c.where(condition);
        TypedQuery<Company> tq = HibernateUtils.getEM().createQuery(c);
        List<Company> result = tq.getResultList();
        return result.size() > 0 ? result.get(0) : null;

    }

    public static Company findCompanyById(String id) {
        Assert.notNull(id, "ID has to be specifies when searching a company");

        Session session = HibernateUtils.getSession();
        CriteriaBuilder qb = session.getCriteriaBuilder();
        CriteriaQuery<Company> c = qb.createQuery(Company.class);
        Root<Company> root = c.from(Company.class);

        Predicate condition = qb.equal(root.get(Company_.id), id);
        c.where(condition);
        TypedQuery<Company> tq = HibernateUtils.getEM().createQuery(c);
        List<Company> result = tq.getResultList();
        return result.get(0);
    }
}
