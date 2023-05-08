package de.uniwue.nachhaltigkeitsscanner.entities;

import javax.persistence.*;
import javax.transaction.Transactional;
import java.util.List;

@Entity
@Transactional
@Table(name = "company")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    @Column(updatable = false, nullable = false)
    private Long id;
    private String name;
    private String contact;
    @Column(length = 1024)
    private String info;
    private String homepage;
    private String ceo;
    private String phonenumber;
    @Column(length = 1024)
    private String address;
    private String headquarters;

    private boolean emas3;
    private boolean iso14001;
    private boolean iso45001;
    private boolean iso50001;
    private boolean iso9001;

    @ElementCollection
    private List<String> sectors;


    //Keycloak userId
    private String userId;


    public Company() {
    }

    public Company(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public String getUserId() {
        return this.userId;
    }

    public void setUser(String userId) {
        this.userId = userId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContact() {
        return this.contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getHomepage() {
        return this.homepage;
    }

    public void setHomepage(String homepage) {
        this.homepage = homepage;
    }

    public String getInfo() {
        return this.info;
    }

    public void setInfo(String info) {
        this.info = info;
    }


    public String getCeo() {
        return this.ceo;
    }

    public void setCeo(String ceo) {
        this.ceo = ceo;
    }

    public String getPhonenumber() {
        return this.phonenumber;
    }

    public void setPhonenumber(String phonenumber) {
        this.phonenumber = phonenumber;
    }

    public String getAddress() {
        return this.address;
    }

    @Override
    public String toString() {
        return "{" +
                " id='" + getId() + "'" +
                ", name='" + getName() + "'" +
                ", contact='" + getContact() + "'" +
                ", homepage='" + getHomepage() + "'" +
                ", info='" + getInfo() + "'" +
                "}";
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<String> getSectors() {
        return sectors;
    }

    public void setSectors(List<String> sectors) {
        this.sectors = sectors;
    }

    public String getHeadquarters() {
        return headquarters;
    }

    public void setHeadquarters(String headquarters) {
        this.headquarters = headquarters;
    }

    public boolean isEMAS3() {
        return emas3;
    }

    public void setEmas3(boolean EMAS3) {
        this.emas3 = EMAS3;
    }

    public boolean isISO14001() {
        return iso14001;
    }

    public void setIso14001(boolean ISO14001) {
        this.iso14001 = ISO14001;
    }

    public boolean isISO45001() {
        return iso45001;
    }

    public void setIso45001(boolean ISO45001) {
        this.iso45001 = ISO45001;
    }

    public boolean isISO50001() {
        return iso50001;
    }

    public void setIso50001(boolean ISO50001) {
        this.iso50001 = ISO50001;
    }

    public boolean isISO9001() {
        return iso9001;
    }

    public void setIso9001(boolean ISO9001) {
        this.iso9001 = ISO9001;
    }
}
