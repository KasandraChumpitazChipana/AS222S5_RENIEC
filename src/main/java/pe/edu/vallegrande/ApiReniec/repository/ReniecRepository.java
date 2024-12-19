package pe.edu.vallegrande.ApiReniec.repository;

import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import pe.edu.vallegrande.ApiReniec.model.DataReniec;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface ReniecRepository extends ReactiveCrudRepository<DataReniec, Long> {

	Flux<DataReniec> findAllByStatus(String status);

	@Modifying
	@Query("update Reniec set status = 'I' where Id = :id")
	Mono<Void> inactiveReniec(Long id);

	@Modifying
	@Query("update Reniec set status = 'A' where Id = :id")
	Mono<Void> activeReniec(Long id);
}
