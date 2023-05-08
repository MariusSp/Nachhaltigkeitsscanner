package de.uniwue.nachhaltigkeitsscanner.controllers;

import de.uniwue.nachhaltigkeitsscanner.entities.Company;
import de.uniwue.nachhaltigkeitsscanner.entities.Company_;
import de.uniwue.nachhaltigkeitsscanner.utils.HibernateUtils;
import de.uniwue.nachhaltigkeitsscanner.utils.CompanyUtils;
import org.hibernate.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import javax.persistence.*;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.List;
import java.util.Optional;

@RestController
public class CompaniesRest {
    private static final Logger logger = LoggerFactory.getLogger(CompaniesRest.class);


    public CompaniesRest() {
    }

    @GetMapping("/api/companyByUserId")
    public Company getCompanyByUserId(@RequestParam(value = "userid") String userid) {
        return CompanyUtils.findCompany(userid, null);
    }

    @GetMapping("/api/availableCompanies")
    public List<Company> getAvailableCompanies() {
        Session session = HibernateUtils.getSession();
        CriteriaBuilder qb = session.getCriteriaBuilder();
        CriteriaQuery<Company> c = qb.createQuery(Company.class);
        Root<Company> root = c.from(Company.class);

        Predicate condition = qb.isNull(root.get(Company_.userId));
        c.where(condition);
        TypedQuery<Company> tq = HibernateUtils.getEM().createQuery(c);
        return tq.getResultList();
    }

    @PostMapping("/api/companies/{companyId}")
    public Company assignUserToCompany(@PathVariable String companyId, @RequestBody String userId) {
        Session session = HibernateUtils.getSession();
        session.clear();
        session.getTransaction().begin();

        Company company = CompanyUtils.findCompanyById(companyId);
        Assert.isNull(company.getUserId(),
                String.format("Cannot assign user to Company. Company is already managed by user with id %s",
                        company.getUserId()));
        company.setUserId(userId);
        session.update(company);
        session.getTransaction().commit();
        return company;
    }

    @GetMapping("/api/companies")
    public List<Company> getAllCompanies() {
        Session session = HibernateUtils.getSession();
        session.clear();
        CriteriaQuery<Company> c = session.getCriteriaBuilder().createQuery(Company.class);
        c.from(Company.class);
        List<Company> result = session.createQuery(c).getResultList();
        return result;
    }

    @GetMapping("/api/companies/{id}")
    public Company getCompanyByID(@PathVariable String id) {
        return CompanyUtils.findCompanyById(id);
    }

    @PostMapping("/api/companies")
    public Company insertCompany(@RequestBody String name) {

        Optional<Company> alreadyExists = getAllCompanies().stream().filter(
                it -> it.getName().equals(name)).findFirst();
        if (alreadyExists.isPresent()) {
            logger.info(String.format("'%s' already exists in Database", alreadyExists.get()));
            return alreadyExists.get();
        }

        Session session = HibernateUtils.getSession();
        session.clear();
        session.getTransaction().begin();
        Company company = new Company(name);
        logger.info(company.toString());
        session.save(company);
        session.getTransaction().commit();


        logger.info(String.format("Inserted Company '%s' into Database", company));
        return company;
    }

    @PutMapping("/api/companies")
    public Company editCompanyData(@RequestBody Company company) {
        Session session = HibernateUtils.getSession();
        session.clear();
        session.getTransaction().begin();
        logger.info(company.toString());
        session.merge(company);
        session.getTransaction().commit();

        logger.info(String.format("Inserted Company '%s' into Database", company));
        return company;
    }

}
